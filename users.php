<?php
require_once __DIR__ . '/config.php';

$admin = requireRole($pdo, ['Admin']);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query(
        'SELECT id, username, role, email, company_name, phone, address, created_at FROM users ORDER BY id'
    );
    jsonResponse(true, 'Users retrieved', $stmt->fetchAll());
}

if ($method === 'POST') {
    requireCsrfToken();
    $data = requestJson();
    $username = trim((string)($data['username'] ?? ''));
    $password = (string)($data['password'] ?? '');
    $email = trim((string)($data['email'] ?? ''));
    $role = trim((string)($data['role'] ?? ''));
    $companyName = trim((string)($data['company_name'] ?? ''));

    if ($username === '' || $email === '' || $password === '') {
        jsonResponse(false, 'Username, email and password are required', [], 400);
    }
    if (strlen($username) > 100 || strlen($password) < 8 || strlen($password) > 4096) {
        jsonResponse(false, 'Username must be at most 100 characters and password at least 8 characters', [], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 150) {
        jsonResponse(false, 'A valid email address is required', [], 400);
    }
    if (!in_array($role, ['Admin', 'Manager', 'Customer', 'Demander', 'Supplier'], true)) {
        jsonResponse(false, 'Invalid role', [], 400);
    }

    $check = $pdo->prepare('SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1');
    $check->execute([':username' => $username, ':email' => $email]);
    if ($check->fetch()) {
        jsonResponse(false, 'User already exists with that username or email', [], 409);
    }

    $insert = $pdo->prepare(
        'INSERT INTO users (username, password_hash, role, email, company_name)
         VALUES (:username, :password_hash, :role, :email, :company_name)'
    );
    $insert->execute([
        ':username' => $username,
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ':role' => $role,
        ':email' => $email,
        ':company_name' => $companyName ?: null,
    ]);

    $userId = (int)$pdo->lastInsertId();
    $userStmt = $pdo->prepare(
        'SELECT id, username, role, email, company_name, phone, address, created_at FROM users WHERE id = :id'
    );
    $userStmt->execute([':id' => $userId]);
    jsonResponse(true, 'User created successfully', $userStmt->fetch(), 201);
}

if ($method === 'PATCH') {
    requireCsrfToken();
    $data = requestJson();
    $userId = filter_var($data['user_id'] ?? null, FILTER_VALIDATE_INT);
    $role = trim((string)($data['role'] ?? ''));

    if (!$userId || $userId <= 0 || !in_array($role, ['Admin', 'Manager', 'Customer', 'Demander', 'Supplier'], true)) {
        jsonResponse(false, 'A valid user_id and role are required', [], 400);
    }
    if ((int)$admin['id'] === $userId && $role !== 'Admin') {
        jsonResponse(false, 'You cannot remove your own Admin role', [], 400);
    }

    $update = $pdo->prepare('UPDATE users SET role = :role WHERE id = :id');
    $update->execute([':role' => $role, ':id' => $userId]);
    if ($update->rowCount() === 0) {
        $exists = $pdo->prepare('SELECT id FROM users WHERE id = :id');
        $exists->execute([':id' => $userId]);
        if (!$exists->fetch()) {
            jsonResponse(false, 'User not found', [], 404);
        }
    }

    jsonResponse(true, 'User role updated', ['user_id' => $userId, 'role' => $role]);
}

header('Allow: GET, POST, PATCH');
jsonResponse(false, 'Method not allowed', [], 405);
