#!/bin/bash

# Indikriti Website Deployment Script
# This script automates the deployment process for the Indikriti website

set -e  # Exit on any error

# Configuration
PROJECT_DIR="/var/www/indikriti"
WEBSITE_DIR="$PROJECT_DIR/indikriti_website"
APP_NAME="indikriti-website"
BACKUP_DIR="/var/backups/indikriti"
LOG_FILE="/var/log/indikriti-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root or with sudo
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Use a regular user with sudo privileges."
    fi
    
    if ! sudo -n true 2>/dev/null; then
        error "This script requires sudo privileges. Please run with a user that has sudo access."
    fi
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    # Create backup directory if it doesn't exist
    sudo mkdir -p "$BACKUP_DIR"
    
    # Create timestamped backup
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/indikriti_backup_$TIMESTAMP.tar.gz"
    
    if [ -d "$WEBSITE_DIR" ]; then
        sudo tar -czf "$BACKUP_FILE" -C "$PROJECT_DIR" indikriti_website/
        log "Backup created: $BACKUP_FILE"
    else
        warning "Website directory not found, skipping backup"
    fi
}

# Update system packages
update_system() {
    log "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
}

# Install Node.js if not present
install_nodejs() {
    if ! command -v node &> /dev/null; then
        log "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        info "Node.js is already installed: $(node --version)"
    fi
}

# Install PM2 if not present
install_pm2() {
    if ! command -v pm2 &> /dev/null; then
        log "Installing PM2..."
        sudo npm install -g pm2
        pm2 startup
    else
        info "PM2 is already installed: $(pm2 --version)"
    fi
}

# Install Nginx if not present
install_nginx() {
    if ! command -v nginx &> /dev/null; then
        log "Installing Nginx..."
        sudo apt install nginx -y
        sudo systemctl start nginx
        sudo systemctl enable nginx
    else
        info "Nginx is already installed"
    fi
}

# Clone or update repository
update_code() {
    log "Updating application code..."
    
    if [ -d "$PROJECT_DIR/.git" ]; then
        log "Pulling latest changes..."
        cd "$PROJECT_DIR"
        git fetch origin
        git reset --hard origin/main
    else
        log "Cloning repository..."
        sudo rm -rf "$PROJECT_DIR"
        sudo git clone https://github.com/your-username/indikriti.git "$PROJECT_DIR"
        sudo chown -R $USER:$USER "$PROJECT_DIR"
    fi
}

# Install dependencies and build
build_application() {
    log "Installing dependencies and building application..."
    
    cd "$WEBSITE_DIR"
    
    # Install dependencies
    npm ci --production=false
    
    # Build for production
    npm run build
    
    log "Application built successfully"
}

# Configure PM2
configure_pm2() {
    log "Configuring PM2..."
    
    cd "$PROJECT_DIR"
    
    # Stop existing application if running
    if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
        pm2 stop "$APP_NAME"
        pm2 delete "$APP_NAME"
    fi
    
    # Start application with PM2
    pm2 start ecosystem.config.js
    pm2 save
    
    log "PM2 configured and application started"
}

# Configure Nginx
configure_nginx() {
    log "Configuring Nginx..."
    
    # Copy Nginx configuration
    if [ -f "$PROJECT_DIR/nginx-indikriti.conf" ]; then
        sudo cp "$PROJECT_DIR/nginx-indikriti.conf" /etc/nginx/sites-available/indikriti
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/indikriti /etc/nginx/sites-enabled/
        
        # Remove default site if it exists
        sudo rm -f /etc/nginx/sites-enabled/default
        
        # Test configuration
        if sudo nginx -t; then
            sudo systemctl reload nginx
            log "Nginx configured successfully"
        else
            error "Nginx configuration test failed"
        fi
    else
        warning "Nginx configuration file not found, skipping Nginx setup"
    fi
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    read -p "Do you want to setup SSL with Let's Encrypt? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Setting up SSL certificate..."
        
        # Install certbot if not present
        if ! command -v certbot &> /dev/null; then
            sudo apt install certbot python3-certbot-nginx -y
        fi
        
        read -p "Enter your domain name: " DOMAIN
        if [ -n "$DOMAIN" ]; then
            sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN"
            log "SSL certificate configured for $DOMAIN"
        else
            warning "No domain provided, skipping SSL setup"
        fi
    fi
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check if PM2 app is running
    if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
        info "✅ PM2 application is running"
    else
        error "❌ PM2 application is not running"
    fi
    
    # Check if Nginx is running
    if sudo systemctl is-active --quiet nginx; then
        info "✅ Nginx is running"
    else
        error "❌ Nginx is not running"
    fi
    
    # Test local connection
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        info "✅ Application responds on localhost:3000"
    else
        warning "⚠️  Application not responding on localhost:3000"
    fi
    
    log "Deployment verification completed"
}

# Cleanup old backups (keep last 5)
cleanup_backups() {
    log "Cleaning up old backups..."
    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t indikriti_backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm --
        log "Old backups cleaned up"
    fi
}

# Main deployment function
main() {
    log "Starting Indikriti website deployment..."
    
    check_permissions
    create_backup
    update_system
    install_nodejs
    install_pm2
    install_nginx
    update_code
    build_application
    configure_pm2
    configure_nginx
    setup_ssl
    verify_deployment
    cleanup_backups
    
    log "🎉 Deployment completed successfully!"
    log "Your website should now be accessible at your domain"
    log "Use 'pm2 status' to check application status"
    log "Use 'pm2 logs $APP_NAME' to view application logs"
}

# Run main function
main "$@"
