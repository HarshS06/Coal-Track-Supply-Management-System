<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Only POST requests allowed', [], 405);
}

$data = requestJson();
$username = trim((string)($data['username'] ?? ''));
$password = (string)($data['password'] ?? '');
$email = trim((string)($data['email'] ?? ''));
$companyName = trim((string)($data['company_name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$address = trim((string)($data['address'] ?? ''));

if ($username === '' || $password === '' || $email === '') {
    jsonResponse(false, 'Username, password and email are required', [], 400);
}
if (strlen($username) > 100 || strlen($password) < 8 || strlen($password) > 4096) {
    jsonResponse(false, 'Username must be at most 100 characters and password at least 8 characters', [], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 150) {
    jsonResponse(false, 'A valid email address is required', [], 400);
}

$check = $pdo->prepare('SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1');
$check->execute([':username' => $username, ':email' => $email]);
if ($check->fetch()) {
    jsonResponse(false, 'User already exists with that username or email', [], 409);
}

$stmt = $pdo->prepare(
    'INSERT INTO users (username, password_hash, role, email, company_name, phone, address)
     VALUES (:username, :password_hash, :role, :email, :company_name, :phone, :address)'
);
$stmt->execute([
    ':username' => $username,
    ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ':role' => 'Customer',
    ':email' => $email,
    ':company_name' => $companyName ?: null,
    ':phone' => $phone ?: null,
    ':address' => $address ?: null,
]);

$userId = (int)$pdo->lastInsertId();
$userStmt = $pdo->prepare(
    'SELECT id, username, role, email, company_name, phone, address FROM users WHERE id = :id'
);
$userStmt->execute([':id' => $userId]);

jsonResponse(true, 'Customer account created. Sign in to continue.', $userStmt->fetch(), 201);
