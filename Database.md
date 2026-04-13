# Database Documentation

## Overview

This document describes the complete database schema for the Shop Management System.

**Database:** PostgreSQL 15+
**ORM:** Prisma / TypeORM (optional)

---

## Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │    categories   │     │    products     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ name            │     │ name            │     │ name            │
│ email           │     │ type            │     │ sku             │
│ password        │     │ color           │     │ category_id(FK) │
│ role            │     │ created_at      │     │ price           │
│ avatar          │     └─────────────────┘     │ cost            │
│ created_at      │                             │ quantity        │
└─────────────────┘                             │ min_stock       │
                                                │ max_stock       │
┌─────────────────┐     ┌─────────────────┐     │ unit            │
│  transactions   │     │  stock_history  │     │ supplier        │
├─────────────────┤     ├─────────────────┤     │ location        │
│ id (PK)         │     │ id (PK)         │     │ description     │
│ type            │     │ product_id (FK) │     │ created_at      │
│ amount          │     │ type            │     └─────────────────┘
│ category_id(FK) │     │ quantity        │
│ description     │     │ previous_stock  │
│ date            │     │ new_stock       │
│ payment_method  │     │ reason          │
│ reference       │     │ reference       │
│ created_by(FK)  │     │ created_by(FK)  │
│ created_at      │     │ created_at      │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     staff       │     │   attendance    │     │    positions    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ name            │     │ staff_id (FK)   │     │ name            │
│ email           │     │ date            │     │ department      │
│ phone           │     │ check_in        │     │ description     │
│ position_id(FK) │     │ check_out       │     │ base_salary     │
│ department      │     │ status          │     │ created_at      │
│ salary          │     │ work_hours      │     └─────────────────┘
│ join_date       │     │ location        │
│ status          │     │ notes           │
│ avatar          │     │ created_at      │
│ created_at      │     └─────────────────┘
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    schedules    │     │    holidays     │     │  leave_requests │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ staff_id (FK)   │     │ name            │     │ staff_id (FK)   │
│ day_of_week     │     │ date            │     │ type            │
│ start_time      │     │ type            │     │ start_date      │
│ end_time        │     │ is_recurring    │     │ end_date        │
│ break_start     │     │ description     │     │ days            │
│ break_end       │     │ created_at      │     │ reason          │
│ is_active       │     └─────────────────┘     │ status          │
│ created_at      │                             │ approved_by(FK) │
└─────────────────┘                             │ approved_at     │
                                                │ created_at      │
┌─────────────────┐                             └─────────────────┘
│telegram_payments│
├─────────────────┤
│ id (PK)         │
│ transaction_id  │
│ amount          │
│ currency        │
│ payment_method  │
│ customer_name   │
│ phone           │
│ description     │
│ status          │
│ raw_data        │
│ processed       │
│ processed_at    │
│ created_at      │
└─────────────────┘
```

---

## Complete SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'operator', 'employee')),
    avatar VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense', 'product')),
    color VARCHAR(7) DEFAULT '#4CAF50',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_type ON categories(type);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    cost DECIMAL(10, 2) DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    max_stock INTEGER DEFAULT 100,
    unit VARCHAR(50) DEFAULT 'piece',
    supplier VARCHAR(255),
    location VARCHAR(255),
    description TEXT,
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products(name);

-- ============================================
-- STOCK HISTORY TABLE
-- ============================================
CREATE TABLE stock_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out', 'adjust')),
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason VARCHAR(255),
    reference VARCHAR(255),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_history_product ON stock_history(product_id);
CREATE INDEX idx_stock_history_created_at ON stock_history(created_at);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    payment_method VARCHAR(100) DEFAULT 'Cash',
    reference VARCHAR(255),
    attachments JSONB DEFAULT '[]',
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_created_by ON transactions(created_by);

-- ============================================
-- POSITIONS TABLE
-- ============================================
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    description TEXT,
    base_salary DECIMAL(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_positions_department ON positions(department);

-- ============================================
-- STAFF TABLE
-- ============================================
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    employee_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    position_id INTEGER REFERENCES positions(id) ON DELETE SET NULL,
    department VARCHAR(255),
    salary DECIMAL(10, 2) DEFAULT 0,
    join_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    avatar VARCHAR(500),
    address TEXT,
    emergency_contact VARCHAR(255),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_position ON staff(position_id);
CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_staff_user ON staff(user_id);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'on_leave', 'half_day')),
    work_hours DECIMAL(4, 2),
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    qr_code VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, date)
);

CREATE INDEX idx_attendance_staff ON attendance(staff_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);

-- ============================================
-- SCHEDULES TABLE
-- ============================================
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, day_of_week)
);

CREATE INDEX idx_schedules_staff ON schedules(staff_id);

-- ============================================
-- HOLIDAYS TABLE
-- ============================================
CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'public' CHECK (type IN ('public', 'company', 'optional')),
    is_recurring BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_holidays_date ON holidays(date);

-- ============================================
-- LEAVE REQUESTS TABLE
-- ============================================
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('annual', 'sick', 'unpaid', 'maternity', 'paternity', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leave_staff ON leave_requests(staff_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_leave_dates ON leave_requests(start_date, end_date);

-- ============================================
-- TELEGRAM PAYMENTS TABLE
-- ============================================
CREATE TABLE telegram_payments (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(100) DEFAULT 'ABA Payway',
    customer_name VARCHAR(255),
    phone VARCHAR(50),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    raw_data JSONB,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    matched_transaction_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_telegram_txn ON telegram_payments(transaction_id);
CREATE INDEX idx_telegram_status ON telegram_payments(status);
CREATE INDEX idx_telegram_created ON telegram_payments(created_at);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON holidays
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@shop.com', '$2b$10$YourHashedPasswordHere', 'admin');

-- Default categories
INSERT INTO categories (name, type, color) VALUES
('Sales', 'income', '#4CAF50'),
('Service', 'income', '#2196F3'),
('Other Income', 'income', '#9C27B0'),
('Rent', 'expense', '#F44336'),
('Utilities', 'expense', '#FF9800'),
('Salaries', 'expense', '#795548'),
('Inventory', 'expense', '#607D8B'),
('Marketing', 'expense', '#E91E63'),
('Other Expense', 'expense', '#9E9E9E'),
('Electronics', 'product', '#3F51B5'),
('Clothing', 'product', '#E91E63'),
('Food & Beverage', 'product', '#8BC34A'),
('Accessories', 'product', '#FF5722');

-- Default positions
INSERT INTO positions (name, department, description, base_salary) VALUES
('Sales Manager', 'Sales', 'Manage sales team and operations', 1500.00),
('Sales Associate', 'Sales', 'Assist customers and process sales', 600.00),
('Cashier', 'Operations', 'Handle payments and transactions', 500.00),
('Inventory Manager', 'Operations', 'Manage stock and inventory', 800.00),
('Store Manager', 'Management', 'Oversee store operations', 2000.00);

-- Default settings
INSERT INTO settings (key, value, type, description) VALUES
('shop_name', 'My Shop', 'string', 'Shop name displayed in the system'),
('shop_currency', 'USD', 'string', 'Default currency for transactions'),
('shop_timezone', 'Asia/Phnom_Penh', 'string', 'Shop timezone'),
('telegram_bot_token', '', 'string', 'Telegram bot token'),
('telegram_chat_id', '', 'string', 'Telegram chat ID for notifications'),
('low_stock_threshold', '5', 'number', 'Default low stock alert threshold'),
('attendance_checkin_time', '09:00', 'string', 'Default check-in time'),
('attendance_checkout_time', '17:00', 'string', 'Default check-out time');
```

---

## Table Descriptions

### users
Stores system user accounts with authentication and role information.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | User full name |
| email | VARCHAR(255) | Unique email address |
| password | VARCHAR(255) | Hashed password |
| role | VARCHAR(50) | User role: admin, operator, employee |
| avatar | VARCHAR(500) | Profile image URL |
| is_active | BOOLEAN | Account status |
| last_login | TIMESTAMP | Last login timestamp |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### categories
Stores categories for transactions and products.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Category name |
| type | VARCHAR(50) | Type: income, expense, product |
| color | VARCHAR(7) | Hex color code |
| description | TEXT | Category description |
| is_active | BOOLEAN | Active status |

### products
Stores product inventory information.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Product name |
| sku | VARCHAR(100) | Unique stock keeping unit |
| category_id | INTEGER | Foreign key to categories |
| price | DECIMAL(10,2) | Selling price |
| cost | DECIMAL(10,2) | Cost price |
| quantity | INTEGER | Current stock quantity |
| min_stock | INTEGER | Minimum stock threshold |
| max_stock | INTEGER | Maximum stock capacity |
| unit | VARCHAR(50) | Unit of measurement |
| supplier | VARCHAR(255) | Supplier name |
| location | VARCHAR(255) | Storage location |
| description | TEXT | Product description |
| images | JSONB | Array of image URLs |
| is_active | BOOLEAN | Product status |

### stock_history
Tracks all stock movements for audit trail.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| product_id | INTEGER | Foreign key to products |
| type | VARCHAR(20) | Movement type: in, out, adjust |
| quantity | INTEGER | Quantity changed |
| previous_stock | INTEGER | Stock before change |
| new_stock | INTEGER | Stock after change |
| reason | VARCHAR(255) | Reason for change |
| reference | VARCHAR(255) | Reference number |
| created_by | INTEGER | User who made the change |
| created_at | TIMESTAMP | Change timestamp |

### transactions
Records all income and expense transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| type | VARCHAR(20) | Transaction type: income, expense |
| amount | DECIMAL(10,2) | Transaction amount |
| category_id | INTEGER | Foreign key to categories |
| description | TEXT | Transaction description |
| date | TIMESTAMP | Transaction date |
| payment_method | VARCHAR(100) | Payment method used |
| reference | VARCHAR(255) | Reference number |
| attachments | JSONB | Array of attachment URLs |
| created_by | INTEGER | User who created the transaction |
| created_at | TIMESTAMP | Creation timestamp |

### positions
Defines job positions in the organization.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Position name |
| department | VARCHAR(255) | Department name |
| description | TEXT | Position description |
| base_salary | DECIMAL(10,2) | Base salary amount |
| is_active | BOOLEAN | Position status |

### staff
Stores employee information.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| employee_code | VARCHAR(50) | Unique employee code |
| name | VARCHAR(255) | Employee name |
| email | VARCHAR(255) | Email address |
| phone | VARCHAR(50) | Phone number |
| position_id | INTEGER | Foreign key to positions |
| department | VARCHAR(255) | Department |
| salary | DECIMAL(10,2) | Current salary |
| join_date | DATE | Employment start date |
| status | VARCHAR(50) | Employment status |
| avatar | VARCHAR(500) | Profile photo URL |
| address | TEXT | Home address |
| emergency_contact | VARCHAR(255) | Emergency contact info |
| user_id | INTEGER | Linked user account |

### attendance
Records daily attendance for staff.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| staff_id | INTEGER | Foreign key to staff |
| date | DATE | Attendance date |
| check_in | TIME | Check-in time |
| check_out | TIME | Check-out time |
| status | VARCHAR(50) | Attendance status |
| work_hours | DECIMAL(4,2) | Hours worked |
| location | VARCHAR(255) | Check-in location |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| qr_code | VARCHAR(255) | QR code used |
| notes | TEXT | Additional notes |

### schedules
Defines work schedules for staff.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| staff_id | INTEGER | Foreign key to staff |
| day_of_week | INTEGER | Day (0=Sunday, 6=Saturday) |
| start_time | TIME | Shift start time |
| end_time | TIME | Shift end time |
| break_start | TIME | Break start time |
| break_end | TIME | Break end time |
| is_active | BOOLEAN | Schedule active status |

### holidays
Stores company and public holidays.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Holiday name |
| date | DATE | Holiday date |
| type | VARCHAR(50) | Holiday type |
| is_recurring | BOOLEAN | Recurs annually |
| description | TEXT | Holiday description |

### leave_requests
Manages employee leave requests.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| staff_id | INTEGER | Foreign key to staff |
| type | VARCHAR(50) | Leave type |
| start_date | DATE | Leave start date |
| end_date | DATE | Leave end date |
| days | INTEGER | Number of days |
| reason | TEXT | Leave reason |
| status | VARCHAR(50) | Request status |
| approved_by | INTEGER | Approver user ID |
| approved_at | TIMESTAMP | Approval timestamp |
| notes | TEXT | Admin notes |

### telegram_payments
Stores payment notifications from Telegram.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| transaction_id | VARCHAR(255) | External transaction ID |
| amount | DECIMAL(10,2) | Payment amount |
| currency | VARCHAR(10) | Currency code |
| payment_method | VARCHAR(100) | Payment method |
| customer_name | VARCHAR(255) | Customer name |
| phone | VARCHAR(50) | Customer phone |
| description | TEXT | Payment description |
| status | VARCHAR(50) | Payment status |
| raw_data | JSONB | Original message data |
| processed | BOOLEAN | Processing status |
| processed_at | TIMESTAMP | Processing timestamp |
| matched_transaction_id | INTEGER | Linked transaction |

### settings
Stores system configuration settings.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| key | VARCHAR(255) | Setting key |
| value | TEXT | Setting value |
| type | VARCHAR(50) | Value type |
| description | TEXT | Setting description |

### audit_logs
Tracks all system changes for audit purposes.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | User who made change |
| action | VARCHAR(100) | Action performed |
| entity_type | VARCHAR(100) | Affected entity type |
| entity_id | INTEGER | Affected entity ID |
| old_values | JSONB | Previous values |
| new_values | JSONB | New values |
| ip_address | INET | User IP address |
| user_agent | TEXT | User agent string |
| created_at | TIMESTAMP | Action timestamp |

---

## Indexes

All tables have appropriate indexes for common query patterns:

- **Foreign key indexes**: For all foreign key columns
- **Search indexes**: For name, email, and description fields
- **Date indexes**: For created_at and date columns
- **Status indexes**: For status and type columns

---

## Relationships

```
users 1:N transactions (created_by)
users 1:N stock_history (created_by)
users 1:N leave_requests (approved_by)
users 1:1 staff (user_id)

categories 1:N transactions (category_id)
categories 1:N products (category_id)

products 1:N stock_history (product_id)

positions 1:N staff (position_id)

staff 1:N attendance (staff_id)
staff 1:N schedules (staff_id)
staff 1:N leave_requests (staff_id)

telegram_payments 0:1 transactions (matched_transaction_id)
```

---

## Backup & Restore

### Backup
```bash
pg_dump -h localhost -U postgres shop_management > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
psql -h localhost -U postgres shop_management < backup_20240115.sql
```

---

## Migration Strategy

Use a migration tool like:
- **Prisma Migrate** (recommended)
- **TypeORM Migrations**
- **Knex.js Migrations**
- **Flyway**

Example Prisma migration:
```bash
npx prisma migrate dev --name add_inventory_tracking
```
