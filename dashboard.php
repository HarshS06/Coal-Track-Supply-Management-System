<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    jsonResponse(false, 'Only GET requests allowed', [], 405);
}

$user = authenticatedUser($pdo);
$role = $user['role'];
$isCustomerRole = in_array($role, ['Customer', 'Demander'], true);
$ordersStmt = $isCustomerRole
    ? $pdo->prepare('SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC')
    : $pdo->query('SELECT * FROM orders ORDER BY created_at DESC');
if ($isCustomerRole) {
    $ordersStmt->execute([':user_id' => $user['id']]);
}
$orders = $ordersStmt->fetchAll();

$notificationsStmt = $pdo->prepare(
    'SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC'
);
$notificationsStmt->execute([':user_id' => $user['id']]);
$notifications = $notificationsStmt->fetchAll();

$data = [
    'role' => $role,
    'orders' => $orders,
    'notifications' => $notifications,
    'recent_activities' => count($orders) > 0
        ? ['Order activity available']
        : ['No recent activities available'],
];

if ($isCustomerRole) {
    $data['my_orders'] = count($orders);
    $data['my_shipments'] = 0;
    $data['notifications_count'] = count($notifications);
    $data['empty_state'] = count($orders) === 0 ? [
        'title' => 'Welcome to CoalTrack!',
        'message' => "You haven't placed any orders yet.",
        'cta' => 'Start by creating your first demand request.',
    ] : null;
    jsonResponse(true, 'Dashboard retrieved', $data);
}

$data['total_orders'] = (int)$pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn();
$data['total_shipments'] = (int)$pdo->query('SELECT COUNT(*) FROM shipments')->fetchColumn();
$data['inventory_count'] = (int)$pdo->query('SELECT COUNT(*) FROM inventory')->fetchColumn();

if ($role === 'Admin') {
    $data['total_users'] = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
}

if (in_array($role, ['Admin', 'Manager', 'Supplier'], true)) {
    $data['inventory'] = $pdo->query('SELECT * FROM inventory ORDER BY id DESC')->fetchAll();
    $data['shipments'] = $pdo->query('SELECT * FROM shipments ORDER BY id DESC')->fetchAll();
}

jsonResponse(true, 'Dashboard retrieved', $data);
