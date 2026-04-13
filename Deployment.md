# Deployment Guide

## Overview

This guide covers deploying the Shop Management System to various environments.

---

## Prerequisites

### Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Storage | 20 GB SSD | 50+ GB SSD |
| OS | Ubuntu 20.04 LTS | Ubuntu 22.04 LTS |
| Node.js | 18.x | 20.x LTS |
| PostgreSQL | 14.x | 15.x |
| Nginx | 1.18+ | 1.24+ |

### Domain & SSL
- Registered domain name
- SSL certificate (Let's Encrypt recommended)

---

## Environment Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git vim nginx certbot python3-certbot-nginx

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # v20.x.x
npm --version   # 10.x.x

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

-- Create database
CREATE DATABASE shop_management;

-- Create user
CREATE USER shopuser WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE shop_management TO shopuser;

-- Exit
\q

# Run schema (from project directory)
psql -U shopuser -d shop_management -f database/schema.sql
```

### 3. Project Setup

```bash
# Create app directory
sudo mkdir -p /var/www/shop-management
cd /var/www/shop-management

# Clone repository (or upload files)
sudo git clone https://github.com/yourusername/shop-management.git .
# OR upload files via SCP/SFTP

# Set ownership
sudo chown -R $USER:$USER /var/www/shop-management

# Install dependencies
cd /var/www/shop-management
npm install

# Build frontend
cd /var/www/shop-management/app
npm install
npm run build

# Build backend
cd /var/www/shop-management/server
npm install
npm run build
```

### 4. Environment Configuration

Create `.env` file in server directory:

```bash
cd /var/www/shop-management/server
cp .env.example .env
nano .env
```

```env
# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://shopuser:your_secure_password@localhost:5432/shop_management

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=https://api.yourdomain.com/telegram/webhook

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
UPLOAD_DIR=/var/www/shop-management/uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Nginx Configuration

### 1. Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/shop-management
```

```nginx
# Frontend - shop.yourdomain.com
server {
    listen 80;
    server_name shop.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name shop.yourdomain.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/shop.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/shop.yourdomain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Frontend static files
    root /var/www/shop-management/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Uploads
    location /uploads {
        alias /var/www/shop-management/uploads;
        expires 1M;
        add_header Cache-Control "public";
    }
}
```

### 2. Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/shop-management /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3. SSL Certificate (Let's Encrypt)

```bash
# Obtain certificate
sudo certbot --nginx -d shop.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run

# Setup auto-renewal cron
sudo systemctl enable certbot.timer
```

---

## PM2 Process Management

### 1. Create PM2 Config

```bash
cd /var/www/shop-management/server
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'shop-management-api',
    script: './dist/index.js',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/shop-management-error.log',
    out_file: '/var/log/pm2/shop-management-out.log',
    log_file: '/var/log/pm2/shop-management-combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 3000,
    max_restarts: 5,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 10000,
    // Auto-restart on failure
    autorestart: true,
    // Don't restart if crashing too fast
    exp_backoff_restart_delay: 100,
    // Health check
    health_check_grace_period: 30000,
    // Environment variables
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 2. Create Log Directory

```bash
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

### 3. Start Application

```bash
cd /var/www/shop-management/server
pm2 start ecosystem.config.js --env production

# Save PM2 config
pm2 save

# Setup startup script
sudo pm2 startup systemd -u $USER --hp $HOME
```

### 4. PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs shop-management-api
pm2 logs shop-management-api --lines 100

# Restart
pm2 restart shop-management-api

# Stop
pm2 stop shop-management-api

# Delete
pm2 delete shop-management-api

# Monitor
pm2 monit
```

---

## Database Backup Automation

### 1. Create Backup Script

```bash
sudo mkdir -p /var/backups/shop-management
sudo nano /usr/local/bin/backup-shop-db.sh
```

```bash
#!/bin/bash

# Configuration
DB_NAME="shop_management"
DB_USER="shopuser"
BACKUP_DIR="/var/backups/shop-management"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup
pg_dump -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Upload to S3 (optional)
# aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-bucket/backups/

# Delete old backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Log
logger "Database backup completed: backup_$DATE.sql.gz"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-shop-db.sh

# Test
sudo /usr/local/bin/backup-shop-db.sh
```

### 2. Schedule Cron Job

```bash
sudo crontab -e
```

```cron
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-shop-db.sh

# Weekly full backup on Sundays
0 3 * * 0 pg_dump -U shopuser shop_management | gzip > /var/backups/shop-management/weekly_$(date +\%Y\%m\%d).sql.gz
```

---

## Docker Deployment (Alternative)

### 1. Create Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache postgresql-client

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start application
CMD ["node", "dist/index.js"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: shop-management-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://shopuser:password@db:5432/shop_management
      - JWT_SECRET=${JWT_SECRET}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    depends_on:
      - db
    networks:
      - shop-network

  db:
    image: postgres:15-alpine
    container_name: shop-management-db
    restart: unless-stopped
    environment:
      - POSTGRES_DB=shop_management
      - POSTGRES_USER=shopuser
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    ports:
      - "5432:5432"
    networks:
      - shop-network

  nginx:
    image: nginx:alpine
    container_name: shop-management-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./app/dist:/usr/share/nginx/html
      - ./uploads:/var/www/uploads
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - app
    networks:
      - shop-network

  certbot:
    image: certbot/certbot
    container_name: shop-management-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  postgres_data:

networks:
  shop-network:
    driver: bridge
```

### 3. Deploy with Docker

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Update
docker-compose pull
docker-compose up -d --build
```

---

## Cloud Deployment

### AWS Deployment

#### 1. EC2 Setup
```bash
# Launch EC2 instance (t3.medium recommended)
# Use Ubuntu 22.04 LTS AMI
# Configure Security Group: 22, 80, 443

# Connect and follow server setup above
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 2. RDS PostgreSQL
```bash
# Create RDS instance
# Engine: PostgreSQL 15
# Instance: db.t3.micro (dev) / db.t3.small (prod)
# Storage: 20GB gp2
# Update security group to allow EC2 access
```

#### 3. S3 for Uploads
```bash
# Create S3 bucket for file uploads
# Configure IAM role for EC2 with S3 access
# Update app to use S3 for file storage
```

#### 4. CloudFront CDN
```bash
# Create CloudFront distribution
# Origin: EC2 or S3
# Enable HTTPS
# Configure caching
```

### Google Cloud Platform

```bash
# Create Compute Engine instance
gcloud compute instances create shop-management \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server

# Create Cloud SQL instance
gcloud sql instances create shop-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --storage-size=20GB

# Deploy to Cloud Run (alternative)
gcloud run deploy shop-management \
  --source . \
  --platform managed \
  --region asia-southeast1
```

### Heroku Deployment

```bash
# Login
heroku login

# Create app
heroku create your-shop-management

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

---

## Monitoring & Logging

### 1. Application Monitoring (PM2)

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true
```

### 2. System Monitoring (Netdata)

```bash
# Install Netdata
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Access: http://your-server:19999
```

### 3. Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
// server/index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## SSL Certificate Renewal

### Automatic Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Manual renewal (if needed)
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal

# View certificates
sudo certbot certificates
```

---

## Troubleshooting

### Common Issues

#### 1. Nginx 502 Bad Gateway
```bash
# Check if API is running
pm2 status
curl http://localhost:3000/health

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check PM2 logs
pm2 logs
```

#### 2. Database Connection Failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U shopuser -d shop_management -c "SELECT 1"

# Check firewall
sudo ufw status
```

#### 3. Permission Denied
```bash
# Fix file permissions
sudo chown -R $USER:$USER /var/www/shop-management
sudo chmod -R 755 /var/www/shop-management

# Fix upload permissions
sudo chmod -R 775 /var/www/shop-management/uploads
```

#### 4. Out of Memory
```bash
# Check memory usage
free -h

# Check PM2 memory
pm2 monit

# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Security Checklist

- [ ] Change default passwords
- [ ] Enable firewall (UFW)
- [ ] Configure fail2ban
- [ ] Enable automatic security updates
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS only
- [ ] Set secure HTTP headers
- [ ] Disable server tokens
- [ ] Regular backups
- [ ] Monitor logs

### Enable Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### Install fail2ban
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

---

## Update Deployment

```bash
# Pull latest changes
cd /var/www/shop-management
git pull origin main

# Install dependencies
cd app && npm install && npm run build
cd ../server && npm install && npm run build

# Run migrations
npm run migrate

# Restart services
pm2 restart shop-management-api
sudo systemctl reload nginx
```

---

## Rollback

```bash
# Rollback to previous version
cd /var/www/shop-management
git log --oneline -10
git checkout <commit-hash>

# Rebuild and restart
npm run build
pm2 restart shop-management-api
```

---

## Support

For deployment issues:
1. Check logs: `pm2 logs`, `sudo tail -f /var/log/nginx/error.log`
2. Verify configuration files
3. Test database connectivity
4. Check firewall settings
5. Review environment variables
