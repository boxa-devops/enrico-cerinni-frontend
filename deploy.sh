#!/bin/bash

# Enrico Cerrini Deployment Script
# This script helps deploy the application using Docker Compose

set -e

echo "🚀 Starting Enrico Cerrini Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file from template if it doesn't exist
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f env.production ]; then
        cp env.production .env
        print_success ".env file created from env.production template"
        print_warning "Please edit .env file with your production values before continuing"
        read -p "Press Enter to continue after editing .env file..."
    else
        print_error "No environment template found. Please create .env file manually."
        exit 1
    fi
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check database
if docker-compose -f docker-compose.prod.yml exec -T db pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
    print_success "Database is healthy"
else
    print_error "Database is not healthy"
    docker-compose -f docker-compose.prod.yml logs db
    exit 1
fi

# Check backend
if curl -f http://localhost:${BACKEND_PORT:-8080}/health > /dev/null 2>&1; then
    print_success "Backend is healthy"
else
    print_error "Backend is not healthy"
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
fi

# Check frontend
if curl -f http://localhost:${FRONTEND_PORT:-3000} > /dev/null 2>&1; then
    print_success "Frontend is healthy"
else
    print_error "Frontend is not healthy"
    docker-compose -f docker-compose.prod.yml logs frontend
    exit 1
fi

print_success "🎉 Deployment completed successfully!"
echo ""
echo "🌐 Your application is now running at:"
echo "   Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "   Backend API: http://localhost:${BACKEND_PORT:-8080}"
if [ "${NGINX_PORT:-80}" != "80" ]; then
    echo "   Nginx Proxy: http://localhost:${NGINX_PORT:-80}"
else
    echo "   Nginx Proxy: http://localhost"
fi
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.prod.yml down"
echo "   Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "   Update services: ./deploy.sh"
