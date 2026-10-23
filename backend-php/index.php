<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
require_once('../db.php');

// Denna filen skapad med LLM baserat på Node.js-Express-kod


function respond(int $code, ?array $body = null): never {
    http_response_code($code);
    if ($body !== null) {
        echo json_encode($body);
    }
    exit;
}


class Request {
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        public readonly array $body,
        public readonly string|false $route,
        public readonly string|false $sid,
		public readonly PDO $pdo
    ) {}

    public static function fromGlobals(string $prefix): self {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
        $path = strtolower(rtrim($path, '/')) ?: '/';

        if (!str_starts_with($path, $prefix)) {
            respond(404, ['message' => 'Bad URL: ' . $path]);
        }
        $path = substr($path, strlen($prefix)) ?: '/';

        [$route, $sid] = self::matchSidRoute($path);

        return new self(
            method: $_SERVER['REQUEST_METHOD'],
            path: $path,
            body: json_decode(file_get_contents('php://input'), true) ?? [],
            route: $route,
            sid: $sid,
			pdo: db_connect_pdo()
        );
    }

    private static function matchSidRoute(string $path): array {
        if (preg_match('#^/api/(session|poll/s|poll/t|question/t|question/s)/([\w-]+)$#', $path, $m)) {
            return [$m[1], $m[2]];
        }
        return [false, false];
    }

	private function findSession(): array {
		$stmt = $this->pdo->prepare('SELECT * FROM klasspuls_sessions WHERE sid = ?');
		$stmt->execute([$this->sid]);
		$s = $stmt->fetch();
		if (!$s) {
			respond(400, ['message' => 'Ingen pågående session.']);
		}
		return $s;
	}

	private function nonApiRoute($url) {
		return !str_starts_with($url, '/api');
	}
	public function route() {
		// // GET / - serve index.html
		if ($this->method === 'GET' && $this->nonApiRoute($this->path) ) { //$this->path === '/') {
		    header('Content-Type: text/html; charset=utf-8');
		    readfile(__DIR__ . '/index.html');
		    exit;
		}

		// Endpoints
		if ($this->method === 'POST' && $this->path === '/api/session') {
			$this->postApiSession($this->pdo, $this->body);
		}
		elseif ($this->method === 'DELETE' && str_starts_with($this->path, '/api/session') && $this->sid !== '') {
			$this->deleteApiSession($this->pdo, $this->method, $this->route, $this->sid);
		}

		$this->s = $this->findSession($this->pdo, $this->sid);
		$this->requireSid();
		// Abort if session id missing

		if( $this->method === 'GET' && str_starts_with($this->path, '/api/poll/s') && $this->s ) {
			$this->pollStudent();
		}
		elseif( $this->method === 'GET' && str_starts_with($this->path, '/api/poll/t') ) {
			$this->pollTeacher();
		}
		elseif( $this->method === 'POST' && str_starts_with($this->path, '/api/question/t') ) {
			$this->teacherStartQuestion();
		}
		elseif( $this->method === 'DELETE' && str_starts_with($this->path, '/api/question/t') ) {
			$this->teacherStopQuestion();
		}
		elseif( $this->method === 'POST' && str_starts_with($this->path, '/api/question/s') ) {
			$this->studentSubmitAnswer();
		}

	}
	private function requireSid() {
		if( !$this->sid ) {
			respond(400, [
				'code' => 400,
				'message' => 'Session id missing'
			]);
		}
	}
	private function generateSessionId() {
		$cons = 'BCDFGHKMNPQRSTVXZ';
		$vow = 'AEIOU';
		$digs = '123456789';
		return $this->pickOne($cons) . $this->pickOne($vow) . $this->pickOne($cons) . $this->pickOne($digs) . $this->pickOne($digs);
	}
	private function pickOne($str) {
		return $str[random_int(0, strlen($str) - 1)];
	}

	// POST /api/session
	private function postApiSession(): void {
		$uid = $this->body['uid'] ?? null;
		if (!is_string($uid) || $uid === '') {
			respond(400, ['message' => 'uid saknas.']);
		}
		$stmt = $this->pdo->prepare('SELECT sid FROM klasspuls_sessions WHERE teacher_id = ?');
		$stmt->execute([$uid]);
		if ($existing = $stmt->fetch()) {
			respond(400, ['message' => "You already have a session: {$existing['sid']}."]);
		}
		$sid = $this->generateSessionId();

		$this->pdo->prepare('INSERT INTO klasspuls_sessions (sid, teacher_id) VALUES (?, ?)')->execute([$sid, $uid]);
		respond(200, ['sid' => $sid]);
	}

	// DELETE /api/session/:sid
	private function deleteApiSession(): void {
		$stmt = $this->pdo->prepare('DELETE FROM klasspuls_sessions WHERE sid = ?');
		$stmt->execute([$this->sid]);
		respond($stmt->rowCount() > 0 ? 204 : 404);
	}

	// GET /api/poll/s/:sid
	private function pollStudent() {
		respond(200, [
			'code' => 200,
			'message' => 'Ok',
			'questionActive' => (bool) $this->s['question_active'],
		]);
	}

	// GET /api/poll/t/:sid
	private function pollTeacher() {
		$stmt = $this->pdo->prepare('SELECT uid, value FROM klasspuls_answers WHERE sid = ?');
		$stmt->execute([$this->sid]);
		respond(200, [
			'code' => 200,
			'message' => 'Ok',
			'questionActive' => (bool) $this->s['question_active'],
			'participants' => [],
			'answers' => $stmt->fetchAll(),
		]);
	}

	// POST /api/question/t/:sid - starta fråga
	private function teacherStartQuestion() {
		$stmt = $this->pdo->prepare('UPDATE klasspuls_sessions SET question_active = 1 WHERE sid = ? AND question_active = 0');
		$stmt->execute([$this->sid]);
		if ($stmt->rowCount() === 0) {
			respond(400, ['message' => 'Det finns redan en pågående fråga.']);
		}
		$this->pdo->prepare('DELETE FROM klasspuls_answers WHERE sid = ?')->execute([$this->sid]);
		respond(204);
	}
	// DELETE /api/question/t/:sid - avsluta fråga
	private function teacherStopQuestion() {
		$stmt = $this->pdo->prepare('UPDATE klasspuls_sessions SET question_active = 0 WHERE sid = ? AND question_active = 1');
		$stmt->execute([$this->sid]);
		if ($stmt->rowCount() === 0) {
			respond(400, ['message' => 'Det finns ingen fråga att stänga.']);
		}
		respond(204);
	}
	// POST /api/question/s/:sid, body: { uid, value }
	private function studentSubmitAnswer() {
		$uid = $this->body['uid'] ?? null;
		$value = $this->body['value'] ?? null;
		if (!is_string($uid) || $uid === '' || !is_numeric($value)) {
			respond(400, ['message' => 'Felaktigt format på studentens svar.'.$uid.'-'.$value.'.'.is_numeric($value)]);
		}
		$stmt = $this->pdo->prepare(
			'INSERT INTO klasspuls_answers (sid, uid, value) VALUES (?, ?, ?)
			 ON DUPLICATE KEY UPDATE value = VALUES(value)'
		);
		$stmt->execute([$this->sid, $uid, $value]);
		// MySQL: 1 = ny rad, 2 = uppdaterad, 0 = oförändrad
		respond($stmt->rowCount() === 1 ? 201 : 204);
	}
}

$req = Request::fromGlobals('/app/klasspuls');
$req->route();




respond(404, ['message' => 'Not found']);

