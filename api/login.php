<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Only POST requests allowed', [], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$username = trim((string)($data['username'] ?? ''));
$password = trim((string)($data['password'] ?? ''));

if ($username === '' || $password === '') {
    jsonResponse(false, 'Username and password are required', [], 400);
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username LIMIT 1');
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonResponse(false, 'Invalid username or password', [], 401);
}

unset($user['password_hash']);
jsonResponse(true, 'Login successful', $user, 200);
