<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    requireRole($pdo, ['Admin', 'Manager', 'Supplier']);
    $stmt = $pdo->query('SELECT * FROM inventory ORDER BY id DESC');
    jsonResponse(true, 'Inventory retrieved', $stmt->fetchAll());
}

if ($method === 'POST') {
    requireRole($pdo, ['Admin', 'Supplier']);
    requireCsrfToken();
    $data = requestJson();
    $itemName = trim((string)($data['item_name'] ?? ''));
    $location = trim((string)($data['location'] ?? ''));
    $quantity = positiveQuantity($data['quantity'] ?? null);
    $status = trim((string)($data['status'] ?? 'Healthy'));

    if ($itemName === '' || strlen($itemName) > 150 || $location === '' || strlen($location) > 150 || $quantity === null) {
        jsonResponse(false, 'item_name, location and a positive numeric quantity are required', [], 400);
    }
    if (!in_array($status, ['Healthy', 'Low Stock', 'Critical', 'In Transit'], true)) {
        jsonResponse(false, 'Invalid inventory status', [], 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO inventory (item_name, location, quantity, status, last_updated)
         VALUES (:item_name, :location, :quantity, :status, NOW())'
    );
    $stmt->execute([
        ':item_name' => $itemName,
        ':location' => $location,
        ':quantity' => number_format((float)$quantity, 2, '.', '') . ' Tons',
        ':status' => $status,
    ]);

    jsonResponse(true, 'Inventory item added successfully', ['id' => (int)$pdo->lastInsertId()], 201);
}

header('Allow: GET, POST');
jsonResponse(false, 'Method not allowed', [], 405);
