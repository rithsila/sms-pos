# API Documentation

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.shopmanager.com/api/v1
```

## Authentication

All API endpoints require authentication via Bearer token in the Authorization header.

```http
Authorization: Bearer <jwt_token>
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@shop.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@shop.com",
      "role": "admin",
      "avatar": "https://..."
    }
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

---

## Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  }
}
```

---

## Dashboard Endpoints

### Get Dashboard Stats
```http
GET /dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "todayIncome": 1250.00,
    "todayExpense": 320.50,
    "todayProfit": 929.50,
    "todayTransactions": 45,
    "monthlyIncome": 28500.00,
    "monthlyExpense": 8740.00,
    "monthlyProfit": 19760.00,
    "inventoryValue": 45600.00,
    "lowStockCount": 8,
    "staffCount": 12,
    "presentToday": 10,
    "breakEven": {
      "daily": 87.40,
      "monthly": 2622.00,
      "currentProgress": 1087
    }
  }
}
```

### Get Chart Data
```http
GET /dashboard/charts?period=month&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "incomeExpense": [
      { "date": "2024-01-01", "income": 1200, "expense": 300 },
      { "date": "2024-01-02", "income": 1500, "expense": 450 }
    ],
    "categoryBreakdown": [
      { "name": "Electronics", "value": 45 },
      { "name": "Clothing", "value": 30 }
    ],
    "topProducts": [
      { "name": "iPhone 15", "sales": 25, "revenue": 25000 }
    ]
  }
}
```

---

## Income/Expense Endpoints

### List Transactions
```http
GET /transactions?page=1&limit=20&type=income&category=Sales&startDate=2024-01-01&endDate=2024-01-31&search=keyword
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "type": "income",
        "amount": 500.00,
        "category": "Sales",
        "description": "Product sale #1234",
        "date": "2024-01-15T10:30:00Z",
        "paymentMethod": "ABA Payway",
        "reference": "TXN123456",
        "createdBy": {
          "id": 1,
          "name": "Admin User"
        },
        "attachments": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### Create Transaction
```http
POST /transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "income",
  "amount": 500.00,
  "category": "Sales",
  "description": "Product sale",
  "date": "2024-01-15T10:30:00Z",
  "paymentMethod": "Cash",
  "reference": "REF123"
}
```

### Update Transaction
```http
PUT /transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 550.00,
  "description": "Updated description"
}
```

### Delete Transaction
```http
DELETE /transactions/:id
Authorization: Bearer <token>
```

### Get Categories
```http
GET /transactions/categories?type=income
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Sales", "type": "income", "color": "#4CAF50" },
    { "id": 2, "name": "Service", "type": "income", "color": "#2196F3" }
  ]
}
```

### Create Category
```http
POST /transactions/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Category",
  "type": "income",
  "color": "#FF5722"
}
```

### Update Category
```http
PUT /transactions/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "color": "#9C27B0"
}
```

### Delete Category
```http
DELETE /transactions/categories/:id
Authorization: Bearer <token>
```

---

## Inventory Endpoints

### List Products
```http
GET /inventory/products?page=1&limit=20&category=Electronics&search=iPhone&lowStock=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "sku": "IP15P-128",
        "category": "Electronics",
        "price": 999.00,
        "cost": 850.00,
        "quantity": 15,
        "minStock": 5,
        "maxStock": 50,
        "unit": "piece",
        "supplier": "Apple Inc.",
        "location": "Shelf A1",
        "description": "Latest iPhone model",
        "images": ["https://..."],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "isLowStock": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

### Create Product
```http
POST /inventory/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "sku": "IP15P-128",
  "category": "Electronics",
  "price": 999.00,
  "cost": 850.00,
  "quantity": 20,
  "minStock": 5,
  "maxStock": 50,
  "unit": "piece",
  "supplier": "Apple Inc.",
  "location": "Shelf A1",
  "description": "Latest iPhone model"
}
```

### Update Product
```http
PUT /inventory/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 899.00,
  "quantity": 25
}
```

### Delete Product
```http
DELETE /inventory/products/:id
Authorization: Bearer <token>
```

### Adjust Stock
```http
POST /inventory/products/:id/adjust
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5,
  "type": "add",
  "reason": "New stock arrival",
  "reference": "PO-12345"
}
```

### Get Stock History
```http
GET /inventory/products/:id/history?page=1&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": 1,
        "type": "in",
        "quantity": 20,
        "previousStock": 0,
        "newStock": 20,
        "reason": "Initial stock",
        "reference": "PO-12345",
        "createdBy": { "id": 1, "name": "Admin" },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Get Categories
```http
GET /inventory/categories
Authorization: Bearer <token>
```

### Create Category
```http
POST /inventory/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Category",
  "description": "Category description"
}
```

### Update Category
```http
PUT /inventory/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name"
}
```

### Delete Category
```http
DELETE /inventory/categories/:id
Authorization: Bearer <token>
```

---

## Staff Endpoints

### List Staff
```http
GET /staff?page=1&limit=20&status=active&search=john
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "staff": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@shop.com",
        "phone": "+855123456789",
        "position": "Sales Manager",
        "department": "Sales",
        "salary": 1500.00,
        "joinDate": "2023-01-15",
        "status": "active",
        "avatar": "https://...",
        "performance": {
          "sales": 45000,
          "transactions": 150,
          "rating": 4.8
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12
    }
  }
}
```

### Create Staff
```http
POST /staff
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@shop.com",
  "phone": "+855987654321",
  "position": "Cashier",
  "department": "Operations",
  "salary": 800.00,
  "joinDate": "2024-01-15"
}
```

### Update Staff
```http
PUT /staff/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "position": "Senior Cashier",
  "salary": 900.00
}
```

### Delete Staff
```http
DELETE /staff/:id
Authorization: Bearer <token>
```

### Get Staff Performance
```http
GET /staff/:id/performance?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSales": 45000,
      "totalTransactions": 150,
      "averageRating": 4.8,
      "attendanceRate": 95
    },
    "daily": [
      { "date": "2024-01-01", "sales": 1500, "transactions": 5 },
      { "date": "2024-01-02", "sales": 2000, "transactions": 7 }
    ]
  }
}
```

---

## Attendance Endpoints

### Get Attendance Dashboard
```http
GET /attendance/dashboard?date=2024-01-15
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalStaff": 12,
      "present": 10,
      "absent": 1,
      "onLeave": 1,
      "late": 2,
      "attendanceRate": 83
    },
    "todayRecords": [
      {
        "id": 1,
        "staff": { "id": 1, "name": "John Doe" },
        "date": "2024-01-15",
        "checkIn": "08:55:00",
        "checkOut": "17:30:00",
        "status": "present",
        "workHours": 8.5,
        "location": "Main Office"
      }
    ]
  }
}
```

### List Attendance Records
```http
GET /attendance/records?page=1&limit=20&staffId=1&startDate=2024-01-01&endDate=2024-01-31&status=present
Authorization: Bearer <token>
```

### Create Attendance Record
```http
POST /attendance/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "staffId": 1,
  "date": "2024-01-15",
  "checkIn": "08:55:00",
  "checkOut": "17:30:00",
  "status": "present",
  "notes": "On time"
}
```

### Update Attendance Record
```http
PUT /attendance/records/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkOut": "18:00:00",
  "notes": "Overtime"
}
```

### Delete Attendance Record
```http
DELETE /attendance/records/:id
Authorization: Bearer <token>
```

### Bulk Update Attendance
```http
POST /attendance/records/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3],
  "status": "present",
  "notes": "Bulk update"
}
```

### QR Code Check-in
```http
POST /attendance/check-in
Authorization: Bearer <token>
Content-Type: application/json

{
  "qrCode": "CHECKIN-2024-01-15",
  "staffId": 1,
  "location": "Main Office",
  "latitude": 11.5564,
  "longitude": 104.9282
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "record": {
      "id": 1,
      "staffId": 1,
      "date": "2024-01-15",
      "checkIn": "08:55:00",
      "status": "present"
    },
    "message": "Check-in successful at 08:55 AM"
  }
}
```

### QR Code Check-out
```http
POST /attendance/check-out
Authorization: Bearer <token>
Content-Type: application/json

{
  "staffId": 1,
  "location": "Main Office"
}
```

### Get QR Code
```http
GET /attendance/qr-code
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": "CHECKIN-2024-01-15",
    "expiresAt": "2024-01-15T23:59:59Z",
    "imageUrl": "https://api.shopmanager.com/qr/CHECKIN-2024-01-15.png"
  }
}
```

### Generate QR Code PDF
```http
GET /attendance/qr-code/pdf
Authorization: Bearer <token>
```

**Response:** PDF file download

---

## Employee Endpoints

### List Employees
```http
GET /employees?page=1&limit=20&status=active&position=1&department=Sales
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": 1,
        "employeeCode": "EMP001",
        "name": "John Doe",
        "email": "john@shop.com",
        "phone": "+855123456789",
        "position": { "id": 1, "name": "Sales Manager" },
        "department": "Sales",
        "joinDate": "2023-01-15",
        "salary": 1500.00,
        "status": "active",
        "avatar": "https://...",
        "address": "123 Main St",
        "emergencyContact": "+855999999999"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 12 }
  }
}
```

### Create Employee
```http
POST /employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@shop.com",
  "phone": "+855987654321",
  "positionId": 2,
  "department": "Operations",
  "joinDate": "2024-01-15",
  "salary": 800.00,
  "address": "456 Oak St",
  "emergencyContact": "+855888888888"
}
```

### Update Employee
```http
PUT /employees/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "positionId": 3,
  "salary": 900.00
}
```

### Delete Employee
```http
DELETE /employees/:id
Authorization: Bearer <token>
```

---

## Position Endpoints

### List Positions
```http
GET /positions?page=1&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "positions": [
      {
        "id": 1,
        "name": "Sales Manager",
        "department": "Sales",
        "description": "Manage sales team",
        "baseSalary": 1500.00,
        "employeeCount": 2
      }
    ]
  }
}
```

### Create Position
```http
POST /positions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cashier",
  "department": "Operations",
  "description": "Handle customer payments",
  "baseSalary": 800.00
}
```

### Update Position
```http
PUT /positions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "baseSalary": 850.00
}
```

### Delete Position
```http
DELETE /positions/:id
Authorization: Bearer <token>
```

---

## Schedule Endpoints

### List Schedules
```http
GET /schedules?page=1&limit=20&employeeId=1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "schedules": [
      {
        "id": 1,
        "employee": { "id": 1, "name": "John Doe" },
        "dayOfWeek": 1,
        "startTime": "09:00:00",
        "endTime": "17:00:00",
        "breakStart": "12:00:00",
        "breakEnd": "13:00:00",
        "isActive": true
      }
    ]
  }
}
```

### Create Schedule
```http
POST /schedules
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1,
  "dayOfWeek": 1,
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "breakStart": "12:00:00",
  "breakEnd": "13:00:00"
}
```

### Update Schedule
```http
PUT /schedules/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "startTime": "08:30:00"
}
```

### Delete Schedule
```http
DELETE /schedules/:id
Authorization: Bearer <token>
```

---

## Holiday Endpoints

### List Holidays
```http
GET /holidays?page=1&limit=20&year=2024
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "holidays": [
      {
        "id": 1,
        "name": "New Year",
        "date": "2024-01-01",
        "type": "public",
        "isRecurring": true,
        "description": "New Year's Day"
      }
    ]
  }
}
```

### Create Holiday
```http
POST /holidays
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Khmer New Year",
  "date": "2024-04-14",
  "type": "public",
  "isRecurring": true,
  "description": "Traditional Cambodian New Year"
}
```

### Update Holiday
```http
PUT /holidays/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-04-13"
}
```

### Delete Holiday
```http
DELETE /holidays/:id
Authorization: Bearer <token>
```

---

## Leave Endpoints

### List Leave Requests
```http
GET /leaves?page=1&limit=20&status=pending&employeeId=1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leaves": [
      {
        "id": 1,
        "employee": { "id": 1, "name": "John Doe" },
        "type": "annual",
        "startDate": "2024-02-01",
        "endDate": "2024-02-03",
        "days": 3,
        "reason": "Family vacation",
        "status": "pending",
        "approvedBy": null,
        "approvedAt": null,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

### Create Leave Request
```http
POST /leaves
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1,
  "type": "sick",
  "startDate": "2024-02-01",
  "endDate": "2024-02-02",
  "reason": "Not feeling well"
}
```

### Approve/Reject Leave
```http
PUT /leaves/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "notes": "Approved for family event"
}
```

### Delete Leave Request
```http
DELETE /leaves/:id
Authorization: Bearer <token>
```

---

## Telegram Integration Endpoints

### Get Bot Status
```http
GET /telegram/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isConnected": true,
    "botName": "ShopManagerBot",
    "botUsername": "@shop_manager_bot",
    "webhookUrl": "https://api.shopmanager.com/telegram/webhook",
    "lastActivity": "2024-01-15T10:30:00Z"
  }
}
```

### Configure Webhook
```http
POST /telegram/webhook
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://api.shopmanager.com/telegram/webhook",
  "secretToken": "your-secret-token"
}
```

### Get Payment Notifications
```http
GET /telegram/payments?page=1&limit=20&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": 1,
        "transactionId": "TXN123456",
        "amount": 500.00,
        "currency": "USD",
        "paymentMethod": "ABA Payway",
        "customerName": "Customer Name",
        "phone": "+855123456789",
        "description": "Product purchase",
        "status": "completed",
        "receivedAt": "2024-01-15T10:30:00Z",
        "processed": true,
        "processedAt": "2024-01-15T10:31:00Z"
      }
    ]
  }
}
```

### Process Payment
```http
POST /telegram/payments/:id/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Sales",
  "description": "iPhone 15 Pro purchase"
}
```

### Test Telegram Connection
```http
POST /telegram/test
Authorization: Bearer <token>
```

---

## Report Endpoints

### Generate Report
```http
POST /reports/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "income_expense",
  "format": "pdf",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "filters": {
    "category": "Sales"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportUrl": "https://api.shopmanager.com/reports/income-expense-2024-01.pdf",
    "expiresAt": "2024-02-01T00:00:00Z"
  }
}
```

### Export Data
```http
POST /reports/export
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "attendance",
  "format": "excel",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

### Get Report Templates
```http
GET /reports/templates
Authorization: Bearer <token>
```

---

## User Endpoints

### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@shop.com",
    "role": "admin",
    "avatar": "https://...",
    "permissions": ["*"],
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Profile
```http
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "avatar": "https://..."
}
```

### Change Password
```http
POST /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

### List Users (Admin only)
```http
GET /users?page=1&limit=20
Authorization: Bearer <token>
```

### Create User (Admin only)
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New User",
  "email": "new@shop.com",
  "password": "password123",
  "role": "operator"
}
```

---

## WebSocket Events

Real-time updates via WebSocket connection:

```javascript
const ws = new WebSocket('wss://api.shopmanager.com/ws?token=<jwt_token>');
```

### Events

#### attendance.updated
```json
{
  "event": "attendance.updated",
  "data": {
    "staffId": 1,
    "action": "check-in",
    "timestamp": "2024-01-15T08:55:00Z"
  }
}
```

#### payment.received
```json
{
  "event": "payment.received",
  "data": {
    "transactionId": "TXN123456",
    "amount": 500.00,
    "paymentMethod": "ABA Payway",
    "receivedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### inventory.low_stock
```json
{
  "event": "inventory.low_stock",
  "data": {
    "productId": 1,
    "productName": "iPhone 15 Pro",
    "currentStock": 2,
    "minStock": 5
  }
}
```

---

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Invalid or missing token | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Invalid input data | 422 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

---

## Rate Limiting

- 100 requests per minute for authenticated users
- 10 requests per minute for login attempts
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Pagination

All list endpoints support pagination:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max 100) |

**Response includes:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Filtering & Sorting

### Filtering
Use query parameters for filtering:
```
GET /transactions?type=income&category=Sales&minAmount=100&maxAmount=1000
```

### Sorting
Use `sort` and `order` parameters:
```
GET /transactions?sort=date&order=desc
```

Supported sort fields vary by endpoint.

---

## Search

Use `search` parameter for text search:
```
GET /products?search=iPhone
GET /staff?search=john
```

Search is case-insensitive and matches partial text in relevant fields.
