# Security Documentation

## Overview

This document outlines security policies, best practices, and implementation details for the Shop Management System.

---

## Security Principles

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimum access required
3. **Fail Secure** - Secure by default
4. **Audit Everything** - Log all security events

---

## Authentication & Authorization

### JWT Implementation

```typescript
// Token Configuration
const JWT_CONFIG = {
  accessTokenExpiry: '15m',      // Short-lived access token
  refreshTokenExpiry: '7d',      // Longer-lived refresh token
  algorithm: 'HS256',
  issuer: 'shop-management-api',
  audience: 'shop-management-client',
};

// Token Structure
interface JWTPayload {
  sub: string;        // User ID
  role: string;       // User role
  iat: number;        // Issued at
  exp: number;        // Expiration
  jti: string;        // Token ID (for revocation)
}
```

### Password Security

```typescript
// Password Requirements
const PASSWORD_POLICY = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  maxAge: 90, // days
};

// Hashing Configuration
const BCRYPT_ROUNDS = 12; // ~250ms per hash
```

### Role-Based Access Control (RBAC)

```typescript
// Permission Matrix
const PERMISSIONS = {
  // Dashboard
  'dashboard.view': ['admin', 'operator', 'employee'],
  
  // Transactions
  'transactions.view': ['admin', 'operator', 'employee'],
  'transactions.create': ['admin', 'operator'],
  'transactions.edit': ['admin', 'operator'],
  'transactions.delete': ['admin'],
  
  // Inventory
  'inventory.view': ['admin', 'operator', 'employee'],
  'inventory.create': ['admin', 'operator'],
  'inventory.edit': ['admin', 'operator'],
  'inventory.delete': ['admin'],
  
  // Staff
  'staff.view': ['admin', 'operator'],
  'staff.create': ['admin'],
  'staff.edit': ['admin'],
  'staff.delete': ['admin'],
  
  // Attendance
  'attendance.view': ['admin', 'operator', 'employee'],
  'attendance.checkin': ['admin', 'operator', 'employee'],
  'attendance.manage': ['admin', 'operator'],
  
  // Settings
  'settings.view': ['admin'],
  'settings.edit': ['admin'],
};

// Permission Check Function
function hasPermission(userRole: string, permission: string): boolean {
  const allowedRoles = PERMISSIONS[permission] || [];
  return allowedRoles.includes(userRole);
}
```

---

## Data Protection

### Encryption at Rest

```typescript
// Database Encryption
const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm',
  keyRotationInterval: 90, // days
  sensitiveFields: [
    'users.password',
    'staff.salary',
    'transactions.amount',
    'telegram_payments.raw_data',
  ],
};

// Field-level Encryption Example
import crypto from 'crypto';

class FieldEncryption {
  private algorithm = 'aes-256-gcm';
  
  encrypt(text: string, key: Buffer): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex'),
    };
  }
  
  decrypt(encrypted: string, iv: string, tag: string, key: Buffer): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### Encryption in Transit

```nginx
# Nginx SSL Configuration
server {
    listen 443 ssl http2;
    
    # SSL Certificates
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Modern SSL Configuration
    ssl_protocols TLSv1.3;
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
}
```

---

## Input Validation

### Request Validation

```typescript
// Validation Middleware
import { z } from 'zod';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive().max(1000000),
  category_id: z.number().int().positive(),
  description: z.string().max(500).optional(),
  date: z.string().datetime(),
  payment_method: z.string().max(100).optional(),
});

function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      });
    }
  };
}

// Usage
app.post('/api/transactions', 
  validateRequest(transactionSchema),
  transactionController.create
);
```

### SQL Injection Prevention

```typescript
// Use Parameterized Queries (Prisma handles this automatically)
// ❌ BAD - Vulnerable to SQL injection
const result = await prisma.$queryRaw`
  SELECT * FROM transactions WHERE type = '${userInput}'
`;

// ✅ GOOD - Parameterized query
const result = await prisma.transactions.findMany({
  where: { type: userInput },
});

// ✅ GOOD - Raw query with parameters
const result = await prisma.$queryRaw`
  SELECT * FROM transactions WHERE type = ${userInput}
`;
```

### XSS Prevention

```typescript
// Sanitize User Input
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: [],
  });
}

// React automatically escapes content
// But be careful with dangerouslySetInnerHTML
function SafeComponent({ content }: { content: string }) {
  const sanitized = sanitizeInput(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

---

## API Security

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API Rate Limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
});

// Apply middleware
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

### CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'https://yourdomain.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

### Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.yourdomain.com'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

---

## File Upload Security

```typescript
import multer from 'multer';
import path from 'path';

// File Upload Configuration
const uploadConfig = {
  // Allowed file types
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ],
  
  // Maximum file size (10MB)
  maxFileSize: 10 * 1024 * 1024,
  
  // Storage configuration
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/var/www/shop-management/uploads/');
    },
    filename: (req, file, cb) => {
      // Generate safe filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const safeName = uniqueSuffix + path.extname(file.originalname);
      cb(null, safeName);
    },
  }),
  
  // File filter
  fileFilter: (req, file, cb) => {
    if (uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
};

const upload = multer(uploadConfig);

// Virus scanning (optional)
import ClamAV from 'clamav.js';

async function scanFile(filePath: string): Promise<boolean> {
  const result = await ClamAV.scanFile(filePath);
  return result.isClean;
}
```

---

## Session Management

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });

app.use(session({
  store: new RedisStore({ client: redisClient }),
  name: 'sessionId', // Don't use default name
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict',
  },
}));
```

---

## Audit Logging

```typescript
// Audit Log Middleware
async function auditLog(
  req: Request,
  action: string,
  entityType: string,
  entityId?: number,
  oldValues?: any,
  newValues?: any
) {
  await prisma.audit_logs.create({
    data: {
      user_id: req.user?.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    },
  });
}

// Usage in routes
app.put('/api/products/:id', async (req, res) => {
  const oldProduct = await prisma.products.findUnique({
    where: { id: req.params.id },
  });
  
  const updated = await prisma.products.update({
    where: { id: req.params.id },
    data: req.body,
  });
  
  await auditLog(
    req,
    'UPDATE',
    'products',
    updated.id,
    oldProduct,
    updated
  );
  
  res.json({ success: true, data: updated });
});
```

---

## Security Checklist

### Development

- [ ] No hardcoded secrets in code
- [ ] Environment variables for sensitive config
- [ ] Input validation on all endpoints
- [ ] Output encoding for user content
- [ ] CSRF protection for state-changing operations
- [ ] Secure dependency management

### Deployment

- [ ] HTTPS only (HSTS enabled)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Database not exposed to internet
- [ ] Firewall rules configured
- [ ] Regular security updates

### Monitoring

- [ ] Failed login attempts logged
- [ ] Suspicious activity alerts
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Penetration testing schedule

---

## Vulnerability Management

### Dependency Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force

# Update specific package
npm update package-name
```

### Automated Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0' # Weekly

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## Incident Response

### Security Incident Procedure

1. **Detect** - Identify the security incident
2. **Contain** - Limit the impact
3. **Eradicate** - Remove the threat
4. **Recover** - Restore normal operations
5. **Learn** - Document and improve

### Emergency Contacts

| Role | Contact |
|------|---------|
| Security Lead | security@yourdomain.com |
| DevOps | devops@yourdomain.com |
| Management | management@yourdomain.com |

---

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Snyk Vulnerability Database](https://snyk.io/vuln)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
