<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, 'Only GET requests allowed', [], 405);
}

$user = authenticatedUser($pdo);
jsonResponse(true, 'Authenticated user retrieved', [
    'user' => $user,
    'csrf_token' => $_SESSION['csrf_token'] ?? createCsrfToken(),
]);
