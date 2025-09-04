# 🚀 Enrico Cerrini Deployment Guide

This guide covers multiple deployment options for your Enrico Cerrini application.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- PostgreSQL (if not using Docker)

## 🏗️ Architecture

Your application consists of:
- **Frontend**: Next.js 15.4.4 (Port 3000)
- **Backend**: FastAPI (Port 8080) 
- **Database**: PostgreSQL (Port 5432)
- **Reverse Proxy**: Nginx (Port 80/443)

## 🐳 Docker Deployment (Recommended)

### Quick Start

1. **Clone and prepare the application:**
   ```bash
   # Make sure you're in the frontend directory
   cd /path/to/enrico-cerrini
   
   # Copy environment template
   cp env.production .env
   
   # Edit environment variables
   nano .env  # or use your preferred editor
   ```

2. **Configure environment variables in `.env`:**
   ```env
   # Database
   POSTGRES_DB=enrico_cerrini
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password
   
   # Backend
   JWT_SECRET=your-very-secure-jwt-secret-key-here
   JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key-here
   
   # Frontend
   FRONTEND_URL=http://your-domain.com
   BACKEND_URL=http://your-domain.com/api
   ```

3. **Deploy with one command:**
   ```bash
   ./deploy.sh
   ```

### Manual Docker Deployment

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## ☁️ Cloud Deployment Options

### 1. DigitalOcean Droplet / AWS EC2 / Google Compute Engine

1. **Create a virtual machine** (Ubuntu 20.04+ recommended)
2. **Install Docker and Docker Compose:**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clone your repository:**
   ```bash
   git clone <your-repo-url>
   cd enrico-cerrini
   ```

4. **Configure environment and deploy:**
   ```bash
   cp env.production .env
   # Edit .env with production values
   ./deploy.sh
   ```

5. **Configure firewall:**
   ```bash
   # Allow HTTP and HTTPS traffic
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

### 2. Vercel (Frontend Only)

For frontend-only deployment to Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Configure environment variables in Vercel dashboard:**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### 3. Railway / Render

Both platforms support Docker deployments:

1. **Connect your GitHub repository**
2. **Set environment variables**
3. **Configure build settings:**
   - Build Command: `docker build -t app .`
   - Start Command: `docker run -p $PORT:3000 app`

### 4. AWS ECS / Google Cloud Run

For container orchestration platforms:

1. **Build and push Docker image:**
   ```bash
   # Build image
   docker build -t enrico-cerrini-frontend .
   
   # Tag for registry
   docker tag enrico-cerrini-frontend:latest your-registry/enrico-cerrini-frontend:latest
   
   # Push to registry
   docker push your-registry/enrico-cerrini-frontend:latest
   ```

2. **Configure service with environment variables**
3. **Set up load balancer and SSL certificate**

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://your-backend-url
NEXT_PUBLIC_APP_NAME=Enrico Cerrini
NODE_ENV=production
```

#### Backend (configure in backend directory)
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://your-frontend-url
```

### SSL/HTTPS Setup

1. **Using Let's Encrypt with Certbot:**
   ```bash
   # Install certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get certificate
   sudo certbot --nginx -d your-domain.com
   ```

2. **Update nginx.conf for HTTPS:**
   ```nginx
   server {
       listen 443 ssl;
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       # ... rest of config
   }
   ```

## 📊 Monitoring and Maintenance

### Health Checks

All services include health checks:
- Frontend: `http://localhost:3000/`
- Backend: `http://localhost:8080/health`
- Database: Built-in PostgreSQL health check

### Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f db
```

### Backup Database

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres enrico_cerrini > backup.sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres enrico_cerrini < backup.sql
```

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Or use deployment script
./deploy.sh
```

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secrets
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs for suspicious activity

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the port
   sudo lsof -i :3000
   sudo lsof -i :8080
   ```

2. **Database connection issues:**
   ```bash
   # Check database logs
   docker-compose -f docker-compose.prod.yml logs db
   
   # Test database connection
   docker-compose -f docker-compose.prod.yml exec db psql -U postgres -d enrico_cerrini
   ```

3. **Frontend not loading:**
   ```bash
   # Check build logs
   docker-compose -f docker-compose.prod.yml logs frontend
   
   # Rebuild frontend
   docker-compose -f docker-compose.prod.yml up -d --build frontend
   ```

4. **API not responding:**
   ```bash
   # Check backend logs
   docker-compose -f docker-compose.prod.yml logs backend
   
   # Test API endpoint
   curl http://localhost:8080/health
   ```

### Getting Help

- Check the logs first: `docker-compose -f docker-compose.prod.yml logs -f`
- Verify environment variables are set correctly
- Ensure all required ports are open
- Check Docker and Docker Compose versions

## 📞 Support

For deployment issues or questions, check:
1. Application logs
2. Docker container status
3. Network connectivity
4. Environment configuration

---

**Happy Deploying! 🎉**
