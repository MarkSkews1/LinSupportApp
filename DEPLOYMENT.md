# LinSupport App - Deployment Guide

## Prerequisites

- Node.js 20+ installed
- MongoDB instance (local or cloud)
- Docker (optional, for containerized deployment)
- Kinde account for authentication

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MarkSkews1/LinSupportApp.git
cd LinSupportApp/lin-support-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Kinde Authentication
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
NEXT_PUBLIC_KINDE_CLIENT_ID=your_client_id
KINDE_SITE_URL=http://localhost:3009
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3009
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3009/dashboard
KINDE_REDIRECT_URL=http://localhost:3009/api/auth/kinde_callback

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lintech_suite
LINSUPPORT_DB_NAME=linsupport

# LinCRM Integration (optional)
LINCRM_API_URL=http://localhost:3001/api
LINCRM_API_KEY=your_api_key
```

---

## Development Deployment

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3009`

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

---

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Docker Deployment

#### Build Docker Image

```bash
docker build -t linsupport:latest .
```

#### Run with Docker Compose

```bash
docker-compose up -d
```

This will start:
- LinSupport App on port 3009
- MongoDB on port 27017

#### Stop Services

```bash
docker-compose down
```

---

## Cloud Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables** in Vercel Dashboard

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### AWS Deployment

#### Using AWS EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. Install Docker and Docker Compose
3. Clone repository
4. Set environment variables
5. Run `docker-compose up -d`

#### Using AWS ECS

1. Build and push Docker image to ECR
2. Create ECS cluster
3. Define task definition
4. Create service
5. Configure load balancer

### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update `MONGODB_URI` in `.env.local`

### Local MongoDB

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
mongod
```

---

## SSL/TLS Configuration

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name support.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name support.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3009;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Using Let's Encrypt

```bash
sudo certbot --nginx -d support.yourdomain.com
```

---

## Monitoring & Logging

### Application Logs

```bash
# View logs in Docker
docker-compose logs -f linsupport

# View specific service logs
docker logs <container_id>
```

### Health Check Endpoint

Create `/api/health` endpoint:

```typescript
export async function GET() {
  return Response.json({ status: 'healthy', timestamp: new Date() });
}
```

### Performance Monitoring

Recommended tools:
- **Sentry** - Error tracking
- **New Relic** - APM
- **DataDog** - Infrastructure monitoring
- **LogRocket** - Session replay

---

## Backup & Recovery

### Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)

# Restore MongoDB
mongorestore --uri="mongodb+srv://..." /backup/20260228
```

### Automated Backups

Set up cron job:

```bash
0 2 * * * /usr/local/bin/backup-script.sh
```

---

## Scaling

### Horizontal Scaling

- Use load balancer (AWS ALB, Nginx)
- Run multiple instances
- Use Redis for session management
- Implement caching strategy

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Enable CDN for static assets
- Implement database connection pooling

---

## Security Checklist

- [ ] All environment variables set correctly
- [ ] HTTPS enabled
- [ ] Database access restricted
- [ ] API rate limiting implemented
- [ ] CORS configured properly
- [ ] Security headers set
- [ ] Dependencies updated
- [ ] Secrets not committed to Git
- [ ] Regular security audits
- [ ] Monitoring and alerts configured

---

## Troubleshooting

### Application Won't Start

1. Check environment variables
2. Verify MongoDB connection
3. Check port availability
4. Review logs for errors

### Database Connection Issues

1. Verify MongoDB URI
2. Check IP whitelist
3. Test connection with MongoDB Compass
4. Verify credentials

### Authentication Issues

1. Verify Kinde credentials
2. Check callback URLs
3. Verify cookie domain settings
4. Test in incognito mode

---

## Support

For deployment issues:
- Check documentation: `/docs`
- Review logs: `docker-compose logs`
- GitHub Issues: https://github.com/MarkSkews1/LinSupportApp/issues

---

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Tests
npm test

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f

# Database backup
mongodump --uri="your-uri" --out=/backup

# Check application health
curl http://localhost:3009/api/health
```

---

**Last Updated:** February 28, 2026  
**Version:** 1.0.0

