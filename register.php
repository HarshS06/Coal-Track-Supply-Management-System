<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Only POST requests allowed', [], 405);
}

$data = json_decode(file_get_contents('php://input'), true);

$username = trim((string)($data['username'] ?? ''));
$password = trim((string)($data['password'] ?? ''));
$role = trim((string)($data['role'] ?? 'Customer'));
$email = trim((string)($data['email'] ?? ''));
$companyName = trim((string)($data['company_name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$address = trim((string)($data['address'] ?? ''));

if ($username === '' || $password === '' || $email === '') {
    jsonResponse(false, 'Username, password and email are required', [], 400);
}

if (!in_array($role, ['Admin', 'Manager', 'Customer'], true)) {
    $role = 'Customer';
}

$check = $pdo->prepare('SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1');
$check->execute([':username' => $username, ':email' => $email]);
if ($check->fetch()) {
    jsonResponse(false, 'User already exists with that username or email', [], 409);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare(
    'INSERT INTO users (username, password_hash, role, email, company_name, phone, address) VALUES (:username, :password_hash, :role, :email, :company_name, :phone, :address)'
);
$stmt->execute([
    ':username' => $username,
    ':password_hash' => $passwordHash,
    ':role' => $role,
    ':email' => $email,
    ':company_name' => $companyName,
    ':phone' => $phone,
    ':address' => $address,
]);

$userId = $pdo->lastInsertId();
$user = $pdo->prepare('SELECT id, username, role, email, company_name, phone, address FROM users WHERE id = :id');
$user->execute([':id' => $userId]);
$userData = $user->fetch();

jsonResponse(true, 'User registered successfully', $userData, 201);
