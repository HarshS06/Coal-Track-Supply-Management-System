<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT * FROM inventory ORDER BY id DESC');
    jsonResponse(true, 'Inventory retrieved', $stmt->fetchAll(), 200);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $itemName = trim((string)($data['item_name'] ?? ''));
    $location = trim((string)($data['location'] ?? ''));
    $quantity = trim((string)($data['quantity'] ?? ''));
    $status = trim((string)($data['status'] ?? 'Healthy'));

    if ($itemName === '' || $location === '' || $quantity === '') {
        jsonResponse(false, 'item_name, location and quantity are required', [], 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO inventory (item_name, location, quantity, status, last_updated) VALUES (:item_name, :location, :quantity, :status, NOW())'
    );
    $stmt->execute([
        ':item_name' => $itemName,
        ':location' => $location,
        ':quantity' => $quantity,
        ':status' => $status,
    ]);

    jsonResponse(true, 'Inventory item added successfully', [], 201);
}

jsonResponse(false, 'Method not allowed', [], 405);
