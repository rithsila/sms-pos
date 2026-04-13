# Shop Management System - Technology Stack

## 1. Frontend Stack

### 1.1 Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI Library |
| **TypeScript** | 5.x | Type Safety |
| **Vite** | 5.x | Build Tool & Dev Server |

### 1.2 Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.x | Utility-first CSS |
| **shadcn/ui** | Latest | UI Component Library |
| **Radix UI** | Latest | Headless UI Primitives |
| **Lucide React** | Latest | Icon Library |

### 1.3 State Management
| Technology | Purpose |
|------------|---------|
| **React useState/useReducer** | Local component state |
| **React Context** | Theme, Auth (future) |

### 1.4 Form Handling
| Technology | Purpose |
|------------|---------|
| **React Hook Form** | Form validation (future) |
| **Zod** | Schema validation (future) |

### 1.5 Data Visualization
| Technology | Version | Purpose |
|------------|---------|---------|
| **Recharts** | 2.x | Charts & Graphs |

### 1.6 Date & Time
| Technology | Version | Purpose |
|------------|---------|---------|
| **date-fns** | 2.x | Date manipulation |

### 1.7 Notifications
| Technology | Purpose |
|------------|---------|
| **Sonner** | Toast notifications |

## 2. Backend Stack (Future Implementation)

### 2.1 Recommended Options

#### Option A: Node.js + Express
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express.js** | Web Framework |
| **TypeScript** | Type Safety |
| **Prisma** | ORM |
| **PostgreSQL** | Database |
| **Redis** | Caching & Sessions |

#### Option B: Laravel (PHP)
| Technology | Purpose |
|------------|---------|
| **Laravel** | Full-stack Framework |
| **PHP** | 8.2+ |
| **MySQL/PostgreSQL** | Database |
| **Laravel Sanctum** | API Authentication |
| **Laravel Queue** | Background Jobs |

### 2.2 API Design
| Specification | Purpose |
|---------------|---------|
| **REST API** | Standard API |
| **OpenAPI/Swagger** | API Documentation |
| **JSON** | Data Format |

## 3. Database Schema (Recommended)

### 3.1 PostgreSQL Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Positions Table
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    position_id UUID REFERENCES positions(id),
    department VARCHAR(255),
    join_date DATE,
    phone VARCHAR(50),
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Income Table
CREATE TABLE incomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    is_fixed BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Schedules Table
CREATE TABLE attendance_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME NOT NULL,
    grace_period_minutes INTEGER DEFAULT 15,
    late_threshold_minutes INTEGER DEFAULT 30,
    early_leave_threshold_minutes INTEGER DEFAULT 15,
    working_days INTEGER[] DEFAULT '{1,2,3,4,5}',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Holidays Table
CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'public',
    description TEXT,
    is_recurring BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Records Table
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    date DATE NOT NULL,
    schedule_id UUID REFERENCES attendance_schedules(id),
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    check_in_method VARCHAR(50) DEFAULT 'qr',
    check_out_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'present',
    working_hours DECIMAL(4, 2),
    overtime_hours DECIMAL(4, 2),
    late_minutes INTEGER,
    early_leave_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave Requests Table
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Telegram Config Table
CREATE TABLE telegram_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_token TEXT,
    webhook_url TEXT,
    is_active BOOLEAN DEFAULT false,
    auto_import_payments BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Telegram Messages Table
CREATE TABLE telegram_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender VARCHAR(255),
    amount DECIMAL(10, 2),
    message TEXT,
    message_type VARCHAR(50),
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. Authentication & Security

### 4.1 Current (Demo)
- No authentication (simulated roles)
- Role-based UI rendering

### 4.2 Future Implementation
| Technology | Purpose |
|------------|---------|
| **JWT (JSON Web Tokens)** | Stateless authentication |
| **Laravel Sanctum** | API token authentication |
| **bcrypt/Argon2** | Password hashing |
| **HTTPS/TLS** | Encrypted communication |
| **CORS** | Cross-origin resource sharing |
| **Rate Limiting** | API abuse prevention |

## 5. Deployment & Infrastructure

### 5.1 Current Deployment
| Service | Purpose |
|---------|---------|
| **Kimi Deploy** | Static site hosting |
| **GitHub** | Source control |

### 5.2 Future Deployment Options

#### Option A: VPS (DigitalOcean/Linode)
| Component | Technology |
|-----------|------------|
| **Server** | Ubuntu 22.04 LTS |
| **Web Server** | Nginx |
| **App Server** | PM2 (Node.js) |
| **Database** | PostgreSQL |
| **SSL** | Let's Encrypt |

#### Option B: Cloud (AWS/GCP/Azure)
| Component | AWS | GCP | Azure |
|-----------|-----|-----|-------|
| **Compute** | EC2 | Compute Engine | VMs |
| **Database** | RDS | Cloud SQL | SQL Database |
| **Storage** | S3 | Cloud Storage | Blob Storage |
| **CDN** | CloudFront | Cloud CDN | CDN |

#### Option C: PaaS (Platform as a Service)
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Railway/Render** | Backend hosting |
| **Supabase** | Database + Auth |
| **Cloudflare** | CDN + DNS |

## 6. Development Tools

### 6.1 Code Quality
| Tool | Purpose |
|------|---------|
| **ESLint** | JavaScript/TypeScript linting |
| **Prettier** | Code formatting |
| **TypeScript** | Type checking |

### 6.2 Version Control
| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **GitHub** | Repository hosting |

### 6.3 IDE/Editor
| Tool | Extensions |
|------|------------|
| **VS Code** | ESLint, Prettier, Tailwind CSS IntelliSense, TypeScript |

## 7. Third-Party Integrations

### 7.1 Current
| Service | Purpose |
|---------|---------|
| **ABA Payway** | Payment processing (Telegram webhook) |

### 7.2 Future
| Service | Purpose |
|---------|---------|
| **Telegram Bot API** | Payment notifications |
| **SendGrid/AWS SES** | Email notifications |
| **Twilio** | SMS notifications |
| **Google Analytics** | Usage tracking |

## 8. Performance Optimization

### 8.1 Current
- Code splitting with Vite
- Lazy loading for sections
- Optimized images (SVG icons)

### 8.2 Future
| Technique | Purpose |
|-----------|---------|
| **React.lazy()** | Component lazy loading |
| **Service Workers** | Offline support |
| **Image Optimization** | WebP format, lazy loading |
| **CDN** | Static asset delivery |
| **Database Indexing** | Query performance |
| **Caching** | Redis for API responses |

## 9. Testing Strategy

### 9.1 Unit Testing
| Tool | Purpose |
|------|---------|
| **Jest** | JavaScript testing |
| **React Testing Library** | Component testing |
| **Vitest** | Vite-native testing |

### 9.2 E2E Testing
| Tool | Purpose |
|------|---------|
| **Cypress** | End-to-end testing |
| **Playwright** | Cross-browser testing |

## 10. Documentation

### 10.1 Code Documentation
| Tool | Purpose |
|------|---------|
| **JSDoc** | Function documentation |
| **TypeScript** | Type documentation |

### 10.2 API Documentation
| Tool | Purpose |
|------|---------|
| **Swagger/OpenAPI** | API specification |
| **Postman** | API testing & docs |

## 11. Technology Comparison

### 11.1 Frontend Frameworks
| Framework | Pros | Cons | Recommendation |
|-----------|------|------|----------------|
| **React** | Large ecosystem, flexible | Steep learning curve | ✅ Current |
| **Vue** | Easy to learn, lightweight | Smaller ecosystem | Alternative |
| **Svelte** | Fast, minimal boilerplate | Smaller community | Alternative |

### 11.2 Backend Frameworks
| Framework | Pros | Cons | Recommendation |
|-----------|------|------|----------------|
| **Node.js/Express** | Same language as frontend, fast | Callback hell | ✅ Recommended |
| **Laravel** | Full-featured, great ORM | PHP learning curve | Alternative |
| **Django** | Batteries included, secure | Python, slower | Alternative |

### 11.3 Databases
| Database | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **PostgreSQL** | Robust, ACID compliant | Complex setup | ✅ Recommended |
| **MySQL** | Widely used, easy | Less feature-rich | Alternative |
| **MongoDB** | Flexible schema | No ACID by default | Not recommended |

## 12. Migration Path

### 12.1 Phase 1: Frontend Only (Current)
- React + TypeScript + Vite
- Mock data
- Static deployment

### 12.2 Phase 2: Add Backend
- Node.js/Express API
- PostgreSQL database
- JWT authentication
- API integration

### 12.3 Phase 3: Production Ready
- Docker containerization
- CI/CD pipeline
- Monitoring & logging
- Backup & recovery
