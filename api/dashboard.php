<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, 'Only GET requests allowed', [], 405);
}

$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
$username = trim((string)($_GET['username'] ?? ''));
$role = trim((string)($_GET['role'] ?? ''));

if (!$userId && $username === '') {
    jsonResponse(false, 'User id or username is required', [], 400);
}

if ($userId > 0) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();
} else {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch();
}

if (!$user) {
    jsonResponse(false, 'User not found', [], 404);
}

$role = $role ?: $user['role'];

$ordersStmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC');
$ordersStmt->execute([':user_id' => $user['id']]);
$orders = $ordersStmt->fetchAll();

$inventoryStmt = $pdo->query('SELECT * FROM inventory ORDER BY id DESC');
$inventory = $inventoryStmt->fetchAll();

$shipmentsStmt = $pdo->query('SELECT * FROM shipments ORDER BY id DESC');
$shipments = $shipmentsStmt->fetchAll();

$notificationsStmt = $pdo->prepare('SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC');
$notificationsStmt->execute([':user_id' => $user['id']]);
$notifications = $notificationsStmt->fetchAll();

if ($role === 'Customer') {
    $customerData = [
        'my_orders' => count($orders),
        'my_shipments' => count($shipments),
        'delivery_status' => count($orders) > 0 ? count($orders) : 0,
        'notifications' => count($notifications),
        'inventory_count' => 0,
        'shipment_count' => 0,
        'orders' => $orders,
        'recent_activities' => count($orders) > 0 ? ['Order placed successfully'] : ['No recent activities available', 'Place your first order to get started'],
        'empty_state' => count($orders) === 0 ? [
            'title' => 'Welcome to CoalTrack!',
            'message' => "You haven't placed any orders yet.",
            'cta' => 'Start by creating your first order.'
        ] : null
    ];

    jsonResponse(true, 'Customer dashboard retrieved', $customerData, 200);
}

$stats = [
    'total_users' => $pdo->query('SELECT COUNT(*) as total FROM users')->fetch()['total'],
    'total_orders' => $pdo->query('SELECT COUNT(*) as total FROM orders')->fetch()['total'],
    'total_shipments' => $pdo->query('SELECT COUNT(*) as total FROM shipments')->fetch()['total'],
    'inventory_count' => $pdo->query('SELECT COUNT(*) as total FROM inventory')->fetch()['total'],
    'orders' => $orders,
    'inventory' => $inventory,
    'shipments' => $shipments,
    'notifications' => $notifications
];

jsonResponse(true, 'Dashboard retrieved', $stats, 200);
