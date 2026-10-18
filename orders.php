<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$customerRoles = ['Customer', 'Demander'];
$staffRoles = ['Admin', 'Manager', 'Supplier'];

if ($method === 'GET') {
    $user = authenticatedUser($pdo);
    if (in_array($user['role'], $customerRoles, true)) {
        $stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute([':user_id' => $user['id']]);
        jsonResponse(true, 'Your orders retrieved', $stmt->fetchAll());
    }
    if (!in_array($user['role'], $staffRoles, true)) {
        jsonResponse(false, 'You do not have permission to view orders', [], 403);
    }

    $stmt = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC');
    jsonResponse(true, 'All orders retrieved', $stmt->fetchAll());
}

if ($method === 'POST') {
    $user = requireRole($pdo, $customerRoles);
    requireCsrfToken();
    $data = requestJson();
    $itemName = trim((string)($data['item_name'] ?? ''));
    $quantity = positiveQuantity($data['quantity'] ?? null);

    if ($itemName === '' || strlen($itemName) > 150 || $quantity === null) {
        jsonResponse(false, 'item_name and a positive numeric quantity are required', [], 400);
    }

    $orderId = 'ORD-' . strtoupper(bin2hex(random_bytes(4)));
    $stmt = $pdo->prepare(
        "INSERT INTO orders (user_id, order_id, item_name, quantity, status)
         VALUES (:user_id, :order_id, :item_name, :quantity, 'Pending')"
    );
    $stmt->execute([
        ':user_id' => $user['id'],
        ':order_id' => $orderId,
        ':item_name' => $itemName,
        ':quantity' => number_format((float)$quantity, 2, '.', '') . ' Tons',
    ]);

    jsonResponse(true, 'Demand request created', ['order_id' => $orderId], 201);
}

if ($method === 'PATCH') {
    $user = requireRole($pdo, $staffRoles);
    requireCsrfToken();
    $data = requestJson();
    $orderId = trim((string)($data['order_id'] ?? ''));
    $status = trim((string)($data['status'] ?? ''));

    if ($orderId === '' || !in_array($status, ['Dispatched', 'Delivered', 'Cancelled'], true)) {
        jsonResponse(false, 'A valid order_id and status are required', [], 400);
    }
    if ($user['role'] === 'Supplier' && $status !== 'Dispatched') {
        jsonResponse(false, 'Suppliers may only approve and dispatch pending orders', [], 403);
    }

    $stmt = $pdo->prepare(
        "UPDATE orders SET status = :status WHERE order_id = :order_id AND status = 'Pending'"
    );
    $stmt->execute([':status' => $status, ':order_id' => $orderId]);
    if ($stmt->rowCount() === 0) {
        $exists = $pdo->prepare('SELECT status FROM orders WHERE order_id = :order_id');
        $exists->execute([':order_id' => $orderId]);
        $order = $exists->fetch();
        if (!$order) {
            jsonResponse(false, 'Order not found', [], 404);
        }
        jsonResponse(false, 'Only pending orders can be updated', ['current_status' => $order['status']], 409);
    }

    jsonResponse(true, 'Order status updated', ['order_id' => $orderId, 'status' => $status]);
}

header('Allow: GET, POST, PATCH');
jsonResponse(false, 'Method not allowed', [], 405);
