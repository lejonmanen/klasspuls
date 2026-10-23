<?php
/* MySQL database account information */
// Settings from file [hemsida.txt]
function db_connect() {
	die('PHP error in db.php: Update to use PDO!');
	/*
	$host = 'localhost';
	$user = 'forverkliga_se';
	$password = '4Jfsf8Z6';
	$db = new mysqli($host, $user, $password, $user);
	if( !empty($db->error) ) {
		exit('Database error #2, '.$db->error);
	}
	$db->set_charset('utf8');
	if( !empty($db->error) ) {
		exit('Database error #2, '.$db->error);
	}
	// $db is guaranteed to have been created ok
	return $db;
	*/
}

function db_connect_pdo() {
	$host = 'localhost';
	// $dbname = 'forverkliga_se';  <- användes före 2026
	$dbname = 'c6kdrqc8i_forverkliga_se';
	$username = 'c6kdrqc8i_forverkliga_se';
	$password = '4Jfsf8Z6';
	$charset = 'utf8';
	$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
	$options = [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
				PDO::ATTR_EMULATE_PREPARES   => false  ];
	$pdo = new PDO($dsn, $username, $password, $options);
	return $pdo;
}

function email_admin($subject, $message) {
	//noreply@forverkliga.se
	mail('admin@forverkliga.se', $subject, $message, "From: noreply@forverkliga.se\r\n");
}
?>
