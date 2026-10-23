# Deploy: fullstack-appen "exempel"

Appen ska ligga på `https://forverkliga.se/app/exempel/`, med API på `https://forverkliga.se/app/exempel/api/...`.

## 1. Tech stack

| Del | Produktion | Lokalt |
|-----|-----------|--------|
| Frontend | Byggda filer från Vite + React, servas av Apache | Vite dev-server (`localhost:5173`) |
| Backend | PHP (en `index.php` med routing) | PHP:s inbyggda server (`localhost:8000`) |
| Databas | MySQL (via PDO) | MySQL i Docker (rekommenderas) eller SQLite |

**Varför MySQL även lokalt?** SQL-dialekterna skiljer sig (t.ex. `ON DUPLICATE KEY UPDATE` finns inte i SQLite). Kör du samma databas lokalt och i produktion slipper du överraskningar vid deploy. SQLite fungerar om du bara använder enkel SQL, och då räcker det att byta `DB_DSN` i `.env`.

### Mappstruktur

```
exempel/
    frontend/
        src/
            api.ts
        .env
        .env.example
        vite.config.ts
        .htaccess             <- laddas upp till /app/exempel/
    backend/
        index.php
        .env
        .env.example
        .htaccess             <- laddas upp till /app/exempel/api/
        schema.sql
    DEPLOY.md
    .gitignore
```

`.gitignore` ska innehålla `.env`, `dist/` och `node_modules/`. Lösenord ska aldrig in i git, därför finns `.env.example` utan hemligheter.

### Lokal databas (Docker)

```bash
docker run --name exempel-db -e MYSQL_ROOT_PASSWORD=dev -e MYSQL_DATABASE=exempel -p 3306:3306 -d mysql:8
docker exec -i exempel-db mysql -uroot -pdev exempel < backend/schema.sql
```

## 2. Frontend: Vite-konfiguration

Mål: `api('/resurs')` ska skicka `GET /app/exempel/api/resurs`.

### `frontend/.env`

```
VITE_BASE_PATH=/app/exempel/
VITE_DEV_API_TARGET=http://localhost:8000
```

- `VITE_BASE_PATH` är appens URL-prefix. Måste börja och sluta med `/`.
- `VITE_DEV_API_TARGET` används bara av dev-servern, för att skicka API-anrop vidare till lokala PHP-servern.

### `frontend/vite.config.ts`

```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    // '' som prefix gör att alla variabler läses, även de utan VITE_
    const env = loadEnv(mode, process.cwd(), '')
    const base = env.VITE_BASE_PATH || '/'

    return {
        base,
        plugins: [react()],
        server: {
            proxy: {
                // /app/exempel/api/... -> http://localhost:8000/app/exempel/api/...
                [`${base}api`]: env.VITE_DEV_API_TARGET || 'http://localhost:8000',
            },
        },
    }
})
```

**Varför det fungerar:**
- `base` gör att byggda filer (`assets/...`) får rätt sökvägar.
- Proxyn skickar API-anrop till PHP under `npm run dev`. Sökvägen ändras inte, så PHP ser samma URL lokalt som i produktion.

### `frontend/src/api.ts`

```typescript
const API = `${import.meta.env.BASE_URL}api`

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(API + path, init)
    if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? `HTTP ${res.status}`)
    }
    if (res.status === 204) return undefined as T
    return res.json()
}
```

Användning:

```typescript
const data = await api<{ id: number }[]>('/resurs')
await api('/resurs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test' }),
})
```

`import.meta.env.BASE_URL` är samma värde som `base`, så prefixet står bara på ett ställe.

### React Router och bilder

- Sätt `basename` på routern, annars skriver den om URL:en till `/`:

```tsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
```

- Bilder importeras (`import logo from './assets/logo.png'`) i stället för att skrivas som `src="/logo.png"`, då lägger Vite på `base` automatiskt.

## 3. Backend: `backend/index.php`

### `backend/.env`

```
APP_ENV=dev
BASE_PATH=/app/exempel/api
DB_DSN=mysql:host=127.0.0.1;dbname=exempel;charset=utf8mb4
DB_USER=root
DB_PASS=dev
```

- `BASE_PATH` är prefixet som tas bort från URL:en innan routingen. Samma värde lokalt och i produktion.
- `APP_ENV=dev` visar felmeddelanden i svaren. Sätt `prod` på servern.
- SQLite i stället: `DB_DSN=sqlite:/absolut/sökväg/dev.db`, med tomma `DB_USER` och `DB_PASS`.
- Värden med specialtecken (`;`, `#`, `=`) ska stå inom citattecken.

### `backend/index.php`

```php
<?php
declare(strict_types=1);

// --- Konfiguration -------------------------------------------------------
$config = parse_ini_file(__DIR__ . '/.env') ?: [];

function config(string $key, string $default = ''): string {
    global $config;
    return (string) ($config[$key] ?? $default);
}

// --- Hjälpfunktioner -----------------------------------------------------
header('Content-Type: application/json; charset=utf-8');

function respond(int $code, ?array $body = null): never {
    http_response_code($code);
    if ($body !== null) {
        echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
    exit;
}

set_exception_handler(function (Throwable $e): void {
    error_log((string) $e);
    $message = config('APP_ENV') === 'dev' ? $e->getMessage() : 'Serverfel.';
    respond(500, ['message' => $message]);
});

function db(): PDO {
    static $pdo = null;
    $pdo ??= new PDO(config('DB_DSN'), config('DB_USER'), config('DB_PASS'), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

// --- Request -------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$path = rtrim($path, '/') ?: '/';

// Ta bort prefixet, så att routes kan skrivas som '/resurs'
$base = rtrim(config('BASE_PATH'), '/');
if ($base !== '' && str_starts_with($path, $base)) {
    $path = substr($path, strlen($base)) ?: '/';
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

// --- Endpoints -----------------------------------------------------------
function getResurs(): void {
    $rows = db()->query('SELECT id, name FROM resurs')->fetchAll();
    respond(200, $rows);
}

function postResurs(array $body): void {
    $name = $body['name'] ?? null;
    if (!is_string($name) || $name === '') {
        respond(400, ['message' => 'name saknas.']);
    }
    $stmt = db()->prepare('INSERT INTO resurs (name) VALUES (?)');
    $stmt->execute([$name]);
    respond(201, ['id' => (int) db()->lastInsertId()]);
}

// --- Routing -------------------------------------------------------------
match (true) {
    $method === 'GET' && $path === '/resurs'
        => getResurs(),
    $method === 'POST' && $path === '/resurs'
        => postResurs($body),
    default
        => respond(404, ['message' => 'Not found']),
};
```

### `backend/schema.sql`

```sql
CREATE TABLE IF NOT EXISTS resurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
```

### Starta lokalt

Två terminaler:

```bash
# Terminal 1: backend (alla anrop går genom index.php)
php -S localhost:8000 backend/index.php

# Terminal 2: frontend
cd frontend && npm run dev
```

Öppna `http://localhost:5173/app/exempel/`. Anrop till `/app/exempel/api/...` proxas till PHP.

## 4. Deploy till forverkliga.se

### Bygg

```bash
cd frontend
npm run build
```

### Serverns struktur

```
/app/exempel/
    index.html            <- från dist/
    assets/               <- från dist/
    .htaccess             <- frontend/.htaccess (SPA-fallback)
    api/
        index.php         <- från backend/
        .htaccess         <- backend/.htaccess
        .env              <- skapas på servern, prod-värden
```

### `/app/exempel/.htaccess` (React Router)

Så att omladdning på t.ex. `/app/exempel/join` ger `index.html`:

```apache
RewriteEngine On
RewriteBase /app/exempel/
RewriteRule ^api/ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

### `/app/exempel/api/.htaccess`

```apache
RewriteEngine On
RewriteBase /app/exempel/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]

# Skydda hemligheter
<Files ".env">
    Require all denied
</Files>
```

En `.htaccess` i en undermapp ersätter förälderns rewrite-regler, och det är därför API-mappen behöver en egen.

### Produktions-`.env` (skapas direkt på servern)

```
APP_ENV=prod
BASE_PATH=/app/exempel/api
DB_DSN=mysql:host=localhost;dbname=DIN_DATABAS;charset=utf8mb4
DB_USER=DIN_ANVÄNDARE
DB_PASS="DITT_LÖSENORD"
```

Skapa tabellerna genom att köra `schema.sql` i phpMyAdmin eller motsvarande.

### Checklista

1. `npm run build`
2. Ladda upp innehållet i `dist/` och frontendens `.htaccess` till `/app/exempel/`
3. Ladda upp `index.php` och `.htaccess` från `backend/` till `/app/exempel/api/`
4. Skapa `.env` på servern med produktionsvärden
5. Kör `schema.sql` mot produktionsdatabasen
6. Testa `https://forverkliga.se/app/exempel/api/resurs` (ska ge JSON) och `https://forverkliga.se/app/exempel/` (ska visa appen)
7. Ladda om sidan på en underadress, för att kontrollera SPA-fallbacken

### Felsökning

| Symptom | Trolig orsak |
|---------|--------------|
| 404 på `/app/exempel/api/resurs` | `.htaccess` i `api/` saknas, eller `mod_rewrite` / `AllowOverride` är avstängt |
| 404 på `assets/...` | `VITE_BASE_PATH` var fel vid bygget |
| Alla API-anrop ger 404 från PHP | `BASE_PATH` i `.env` stämmer inte med URL:en |
| URL:en blir `/` i webbläsaren | `basename` saknas på React Router |
| `ECONNREFUSED` i Vite | Lokala PHP-servern är inte startad |
| 500 utan förklaring | Sätt `APP_ENV=dev` tillfälligt, och kolla serverns error-logg |
