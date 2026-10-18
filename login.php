<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Only POST requests allowed', [], 405);
}

$data = requestJson();
$username = trim((string)($data['username'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($username === '' || $password === '') {
    jsonResponse(false, 'Username and password are required', [], 400);
}

$stmt = $pdo->prepare('SELECT id, username, password_hash FROM users WHERE username = :username LIMIT 1');
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonResponse(false, 'Invalid username or password', [], 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int)$user['id'];
$csrfToken = createCsrfToken();
$authenticated = authenticatedUser($pdo);

jsonResponse(true, 'Login successful', [
    'user' => $authenticated,
    'csrf_token' => $csrfToken,
], 200);
