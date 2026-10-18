<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.use_trans_sid', '0');
session_set_cookie_params([
    'httponly' => true,
    'secure' => $https,
    'samesite' => 'Lax',
    'path' => '/',
]);
session_start();

$host = getenv('COALTRACK_DB_HOST') ?: 'localhost';
$dbname = getenv('COALTRACK_DB_NAME') ?: 'coaltrack';
$dbuser = getenv('COALTRACK_DB_USER') ?: 'root';
$dbpass = getenv('COALTRACK_DB_PASSWORD') ?: '';

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $dbuser,
        $dbpass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    error_log('CoalTrack database connection failed: ' . $e->getMessage());
    jsonResponse(false, 'Database connection failed', [], 500);
}

function jsonResponse(bool $success, string $message, $data = [], int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
    ], JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function requestJson(): array
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        jsonResponse(false, 'A valid JSON object is required', [], 400);
    }
    return $data;
}

function authenticatedUser(PDO $pdo): array
{
    $userId = (int)($_SESSION['user_id'] ?? 0);
    if ($userId <= 0) {
        jsonResponse(false, 'Authentication required', [], 401);
    }

    $stmt = $pdo->prepare(
        'SELECT id, username, role, email, company_name, phone, address FROM users WHERE id = :id LIMIT 1'
    );
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();
    if (!$user) {
        session_unset();
        session_destroy();
        jsonResponse(false, 'Authentication required', [], 401);
    }

    $_SESSION['role'] = $user['role'];
    return $user;
}

function requireRole(PDO $pdo, array $allowedRoles): array
{
    $user = authenticatedUser($pdo);
    if (!in_array($user['role'], $allowedRoles, true)) {
        jsonResponse(false, 'You do not have permission to perform this action', [], 403);
    }
    return $user;
}

function requireCsrfToken(): void
{
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    if ($token === '' || $sessionToken === '' || !hash_equals($sessionToken, $token)) {
        jsonResponse(false, 'A valid CSRF token is required', [], 403);
    }
}

function createCsrfToken(): string
{
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf_token'];
}

function positiveQuantity($value): ?float
{
    if (!is_numeric($value)) {
        return null;
    }
    $quantity = (float)$value;
    return is_finite($quantity) && $quantity > 0 ? $quantity : null;
}
