# CoalTrack PHP + MySQL API

This backend uses PHP sessions for authentication. User roles are stored in the `users` table and checked by the API on every protected request. Do not send a role or user ID to decide what a caller may access.

## Setup

1. Install XAMPP and start Apache and MySQL.
2. Import `coaltrack.sql` in phpMyAdmin. The SQL creates the `coaltrack` database and updates existing installations to support `Admin`, `Manager`, `Customer`, `Demander`, and `Supplier`.
3. Place the project folder under `C:\xampp\htdocs\coaltrack`.
4. If needed, configure database connection environment variables before starting Apache:
   - `COALTRACK_DB_HOST` (default `localhost`)
   - `COALTRACK_DB_NAME` (default `coaltrack`)
   - `COALTRACK_DB_USER` (default `root`)
   - `COALTRACK_DB_PASSWORD` (default empty)
5. Use the API at `http://localhost/coaltrack/`. Serve the frontend from the same origin so the browser sends the PHP session cookie. Do not open the HTML directly with a `file://` URL for authenticated API requests.

> The current `coal (1).html` page still contains its original demo/localStorage login and tracker. It does not yet call these PHP endpoints; the API authorization is enforced server-side when clients use the documented endpoints.

## Roles

| Role | Allowed actions |
| --- | --- |
| Admin | View dashboard, inventory, and all orders; add inventory; approve orders; manage accounts and assign any role |
| Manager | View operational dashboard and inventory; view and update orders |
| Supplier | View operational dashboard and inventory; add stock; view orders and dispatch pending orders |
| Demander | Create demand/order requests and view only their own requests |
| Customer | Create orders and view only their own orders |

Public registration always creates a `Customer`. Only an authenticated Admin can create accounts with elevated roles or change a user role.

## Authentication and API use

Login establishes an HttpOnly PHP session cookie and returns the account role and a CSRF token:

```http
POST /coaltrack/login.php
Content-Type: application/json

{"username":"admin","password":"your-password"}
```

The browser must keep the session cookie and send the returned `csrf_token` in `X-CSRF-Token` for POST/PATCH/DELETE requests that require authentication. Use `GET /coaltrack/me.php` to retrieve the authenticated account and current CSRF token. Use `POST /coaltrack/logout.php` with that CSRF token to end the session.

### Endpoints

| Endpoint | Methods | Access |
| --- | --- | --- |
| `register.php` | POST | Public; always creates a Customer |
| `login.php` | POST | Public |
| `me.php` | GET | Any authenticated user |
| `logout.php` | POST | Any authenticated user; CSRF token required |
| `users.php` | GET, POST, PATCH | Admin only; mutations require a CSRF token |
| `dashboard.php` | GET | Any authenticated user; response is filtered by the session role |
| `inventory.php` | GET | Admin, Manager, Supplier |
| `inventory.php` | POST | Admin, Supplier; CSRF token required |
| `orders.php` | GET | Customer/Demander see only their own; Admin/Manager/Supplier see all |
| `orders.php` | POST | Customer/Demander; creates a Pending order owned by the session user |
| `orders.php` | PATCH | Admin/Manager/Supplier; Supplier may only dispatch pending orders |

Examples for Admin user management:

```http
POST /coaltrack/users.php
Content-Type: application/json
X-CSRF-Token: <token-from-login-or-me>

{"username":"supplier1","password":"use-a-strong-password","email":"supplier@example.com","role":"Supplier"}
```

```http
PATCH /coaltrack/users.php
Content-Type: application/json
X-CSRF-Token: <token-from-login-or-me>

{"user_id":4,"role":"Demander"}
```

Orders can be created with an item name and positive numeric quantity. The API ignores client-supplied `user_id` and `status`; ownership is set from the authenticated session and new orders always start as `Pending`. Staff dispatch with:

```http
PATCH /coaltrack/orders.php
Content-Type: application/json
X-CSRF-Token: <token-from-login-or-me>

{"order_id":"ORD-1234ABCD","status":"Dispatched"}
```

## Important deployment note

The SQL file includes demo seed accounts. Change their passwords immediately in a non-demo deployment. Use HTTPS in production so PHP marks the session cookie `Secure`. Configure the database credentials with environment variables rather than committing production credentials.
