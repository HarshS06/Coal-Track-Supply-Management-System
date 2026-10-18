CREATE DATABASE IF NOT EXISTS coaltrack;
USE coaltrack;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin','Manager','Customer') NOT NULL DEFAULT 'Customer',
  email VARCHAR(150) NOT NULL,
  company_name VARCHAR(150) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  quantity VARCHAR(50) NOT NULL,
  status ENUM('Healthy','Low Stock','Critical','In Transit') NOT NULL DEFAULT 'Healthy',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shipment_id VARCHAR(50) NOT NULL UNIQUE,
  source VARCHAR(150) NOT NULL,
  destination VARCHAR(150) NOT NULL,
  quantity VARCHAR(50) NOT NULL,
  dispatch_date DATE NOT NULL,
  delivery_date DATE NOT NULL,
  status ENUM('Pending','In Transit','Delayed','Delivered') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  item_name VARCHAR(150) NOT NULL,
  quantity VARCHAR(50) NOT NULL,
  status ENUM('Pending','Dispatched','Delivered','Cancelled') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, password_hash, role, email, company_name, phone, address)
VALUES
  ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'admin@coaltrack.com', 'CoalTrack', '0000000000', 'HQ'),
  ('manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager', 'manager@coaltrack.com', 'CoalTrack Ops', '0000000001', 'Operations Office');

INSERT INTO inventory (item_name, location, quantity, status, last_updated)
VALUES
  ('Anthracite Grade A', 'Korba Yard', '18500 Tons', 'Healthy', NOW()),
  ('Bituminous Grade B', 'Nagpur Route', '12340 Tons', 'Healthy', NOW()),
  ('Lignite Premium', 'Bina Depot', '9120 Tons', 'Low Stock', NOW()),
  ('Coking Coal Supreme', 'Raigarh Plant', '7900 Tons', 'Critical', NOW());

INSERT INTO shipments (shipment_id, source, destination, quantity, dispatch_date, delivery_date, status)
VALUES
  ('SHIP-901', 'Korba Mine', 'Nagpur Terminal', '1250 Tons', '2026-09-15', '2026-09-20', 'In Transit'),
  ('SHIP-902', 'Raigarh Yard', 'Bhilai Plant', '980 Tons', '2026-09-12', '2026-09-18', 'Delayed'),
  ('SHIP-903', 'Bilaspur Depot', 'Durg Hub', '1450 Tons', '2026-09-10', '2026-09-17', 'Delivered');

INSERT INTO notifications (user_id, message)
VALUES
  (1, 'New coal order approved from Jindal Steel'),
  (2, 'Dispatch schedule updated for East branch');
