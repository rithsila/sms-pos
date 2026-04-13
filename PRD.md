# Shop Management System - Product Requirements Document

## 1. Executive Summary

### 1.1 Product Overview
The Shop Management System is a comprehensive web-based application designed to help small to medium-sized retail businesses manage their daily operations including income/expense tracking, inventory management, staff management, and attendance tracking.

### 1.2 Target Users
- **Shop Owners/Admins**: Full system access
- **Operators**: Limited administrative access
- **Employees**: Basic access for attendance and personal records

### 1.3 Current Status
- **Version**: 1.0.0
- **Deployment**: Live at https://dos63vzh5wevu.ok.kimi.link
- **Status**: MVP Complete, Ready for Enhancement

---

## 2. Feature Requirements

### 2.1 Core Modules

#### 2.1.1 Dashboard
| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| KPI Cards (Revenue, Expenses, Profit, Orders) | P0 | ✅ Complete | Real-time calculations |
| Revenue vs Expenses Chart | P0 | ✅ Complete | 12-month trend |
| Recent Transactions List | P0 | ✅ Complete | Last 5 transactions |
| Low Stock Alerts | P0 | ✅ Complete | Auto-calculate from inventory |
| Staff Overview | P1 | ✅ Complete | Performance & attendance |

#### 2.1.2 Income & Expense Tracker
| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Add Income (Sales, Service, Other) | P0 | ✅ Complete | With category selection |
| Add Expense (Rent, Utilities, Inventory, Salary, Other) | P0 | ✅ Complete | Pre-defined categories |
| Transaction List with Search | P0 | ✅ Complete | Filter by type |
| Fixed Monthly Expenses Display | P0 | ✅ Complete | Based on user's $2,622 fixed costs |
| Net Profit Calculation | P0 | ✅ Complete | Auto-calculate |
| Edit/Delete Transactions | P1 | 🔄 Planned | Backend integration needed |

#### 2.1.3 Inventory Management
| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Product CRUD | P0 | ✅ Complete | Name, SKU, Category, Price, Stock |
| Stock Level Alerts | P0 | ✅ Complete | Min stock threshold |
| Category Filtering | P0 | ✅ Complete | 6 categories |
| Grid/List View Toggle | P0 | ✅ Complete | User preference |
| Low Stock Dashboard Widget | P0 | ✅ Complete | Shows count |
| Product Images | P2 | 🔄 Planned | Image upload feature |
| Barcode Support | P2 | 🔄 Planned | Scanner integration |

#### 2.1.4 Staff Management
| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Employee Profiles | P0 | ✅ Complete | Name, Role, Contact, Avatar |
| Performance Tracking | P0 | ✅ Complete | Percentage score |
| Sales Tracking | P0 | ✅ Complete | Monthly sales per staff |
| Attendance Integration | P0 | ✅ Complete | Linked to attendance module |
| Add/Edit/Delete Staff | P1 | ✅ Complete | With role assignment |
| Role-Based Access | P0 | ✅ Complete | Admin, Operator, Employee |

#### 2.1.5 Attendance Management (Enhanced)
| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| **Dashboard** | P0 | ✅ Complete | Today's stats, pending leaves |
| **Calendar View** | P0 | ✅ Complete | Monthly attendance grid |
| **Employee Management** | P0 | ✅ Complete | CRUD with bulk operations |
| **Position Management** | P0 | ✅ Complete | Job positions with departments |
| **Schedule Management** | P0 | ✅ Complete | Time windows, grace periods |
| **Holiday Management** | P0 | ✅ Complete | Auto-blocks attendance |
| **Leave Requests** | P0 | ✅ Complete | Submit & approve workflow |
| **QR Code Check-in** | P0 | ✅ Complete | Single QR for all staff |
| **Export (CSV/Excel)** | P0 | ✅ Complete | One-click export |
| **Bulk Operations** | P1 | ✅ Complete | Select multiple records |
| **PDF QR Download** | P1 | 🔄 Planned | Print-ready format |
| **Real-time Presence** | P1 | 🔄 Planned | WebSocket integration |

#### 2.1.6 Product Categories
| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Category CRUD | P0 | ✅ Complete | Name, Icon, Color |
| Product Count Display | P0 | ✅ Complete | Per category |
| Color Picker | P0 | ✅ Complete | 8 color options |
| Icon Selection | P0 | ✅ Complete | 6 icon options |

#### 2.1.7 Telegram Bot Integration
| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Connection Status | P0 | ✅ Complete | Visual indicator |
| Webhook Configuration | P0 | ✅ Complete | URL display |
| Auto-import Payments | P0 | ✅ Complete | Toggle on/off |
| Message History | P0 | ✅ Complete | Recent messages |
| Test Connection | P1 | ✅ Complete | With loading state |
| ABA Payway Integration | P1 | 🔄 Planned | Actual webhook setup |

#### 2.1.8 Reports & Analytics
| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Financial Reports | P0 | ✅ Complete | Revenue, Expenses, Profit |
| Product Analytics | P0 | ✅ Complete | Inventory value by category |
| Staff Performance | P0 | ✅ Complete | Rankings & metrics |
| Export Options | P0 | ✅ Complete | PDF, Excel, CSV |
| Date Range Filter | P0 | ✅ Complete | 7/30/90/365 days |
| Custom Reports | P2 | 🔄 Planned | User-defined reports |

---

## 3. User Stories

### 3.1 Shop Owner (Admin)
- As an admin, I want to see my daily revenue and expenses at a glance
- As an admin, I want to track which products are running low on stock
- As an admin, I want to approve or reject employee leave requests
- As an admin, I want to export financial data for accounting
- As an admin, I want to see staff performance metrics

### 3.2 Operator
- As an operator, I want to record daily sales and expenses
- As an operator, I want to manage inventory stock levels
- As an operator, I want to view employee attendance records
- As an operator, I want to generate reports for the owner

### 3.3 Employee
- As an employee, I want to check in/out using QR code
- As an employee, I want to request leave
- As an employee, I want to view my attendance history
- As an employee, I want to see my performance metrics

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load time < 2 seconds
- Smooth animations at 60fps
- Support for 1000+ products
- Support for 50+ employees

### 4.2 Security
- Role-based access control
- Secure authentication (future: JWT/Sanctum)
- Data encryption for sensitive information
- HTTPS only

### 4.3 Usability
- Mobile-responsive design
- Intuitive navigation
- Toast notifications for actions
- Form validation with clear error messages

### 4.4 Compatibility
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 5. Future Roadmap

### Phase 2 (Next 3 months)
- [ ] Backend API with database (PostgreSQL/MySQL)
- [ ] User authentication system
- [ ] Real-time attendance with WebSocket
- [ ] Mobile app (React Native/Flutter)
- [ ] Multi-shop support
- [ ] Advanced reporting with charts

### Phase 3 (6 months)
- [ ] POS (Point of Sale) integration
- [ ] Customer loyalty program
- [ ] Supplier management
- [ ] Purchase order system
- [ ] Advanced analytics with AI insights

### Phase 4 (12 months)
- [ ] Multi-language support
- [ ] White-label solution
- [ ] API marketplace
- [ ] Third-party integrations (accounting software)

---

## 6. Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Daily Active Users | 10+ | 1 (demo) |
| Data Accuracy | 99% | N/A |
| Page Load Time | <2s | ~1s |
| User Satisfaction | 4.5/5 | N/A |
| Feature Adoption | 80% | N/A |

---

## 7. Appendix

### 7.1 Fixed Monthly Expenses (User's Data)
| Expense | Amount (USD) |
|---------|--------------|
| Rental fee | $680 |
| Staff salary (4 people) | $720 |
| Electricity bill | $800 |
| Franchise management fee | $117 |
| Other expenses | $200 |
| Garbage fee | $30 |
| Internet fee | $15 |
| Staff benefits | $60 |
| **Total Fixed** | **$2,622** |

### 7.2 Break-even Analysis
- At 40% profit margin: Need $6,555/month in sales
- At 30% profit margin: Need $8,740/month in sales
- Average order value: $2.50

### 7.3 User's Business Info
- Currency: USD ($)
- Language: English
- Payment Gateway: ABA Payway (Telegram integration)
- Staff Count: 4 employees
- Location: Cambodia (implied from ABA Payway)
