<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
    if ($userId > 0) {
        $stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute([':user_id' => $userId]);
        jsonResponse(true, 'Orders retrieved', $stmt->fetchAll(), 200);
    }

    $stmt = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC');
    jsonResponse(true, 'All orders retrieved', $stmt->fetchAll(), 200);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = isset($data['user_id']) ? (int)$data['user_id'] : 0;
    $itemName = trim((string)($data['item_name'] ?? ''));
    $quantity = trim((string)($data['quantity'] ?? ''));
    $status = trim((string)($data['status'] ?? 'Pending'));

    if ($userId <= 0 || $itemName === '' || $quantity === '') {
        jsonResponse(false, 'user_id, item_name and quantity are required', [], 400);
    }

    $orderId = 'ORD-' . strtoupper(bin2hex(random_bytes(4)));
    $stmt = $pdo->prepare(
        'INSERT INTO orders (user_id, order_id, item_name, quantity, status) VALUES (:user_id, :order_id, :item_name, :quantity, :status)'
    );
    $stmt->execute([
        ':user_id' => $userId,
        ':order_id' => $orderId,
        ':item_name' => $itemName,
        ':quantity' => $quantity,
        ':status' => $status,
    ]);

    jsonResponse(true, 'Order created successfully', ['order_id' => $orderId], 201);
}

jsonResponse(false, 'Method not allowed', [], 405);
