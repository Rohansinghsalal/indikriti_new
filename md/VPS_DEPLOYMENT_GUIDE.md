# 🚀 Indikriti Website VPS Deployment Guide

This guide provides step-by-step instructions for deploying the Indikriti website on a VPS server using PM2 and Nginx.

## 📋 Prerequisites

- Ubuntu/Debian VPS server (minimum 2GB RAM, 20GB storage)
- Root or sudo access
- Domain name pointed to your VPS IP address
- Basic knowledge of Linux command line

## 🛠️ Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js (v18 or higher)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install PM2 Process Manager
```bash
sudo npm install -g pm2
```

### 4. Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Install Git
```bash
sudo apt install git -y
```

## 📁 Project Deployment

### 1. Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/your-username/indikriti.git
sudo chown -R $USER:$USER /var/www/indikriti
cd /var/www/indikriti/indikriti_website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build for Production
```bash
npm run build
```

### 4. Create PM2 Configuration
Create `/var/www/indikriti/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'indikriti-website',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/indikriti/indikriti_website',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 5. Start Application with PM2
```bash
cd /var/www/indikriti
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 Nginx Configuration

### 1. Create Nginx Site Configuration
Create `/etc/nginx/sites-available/indikriti`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri $uri/ @proxy;
    }

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Fallback for static files
    location @proxy {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable Site and Test Configuration
```bash
sudo ln -s /etc/nginx/sites-available/indikriti /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL Certificate (Optional but Recommended)

### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtain SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 Environment Configuration

### 1. Create Production Environment File
Create `/var/www/indikriti/indikriti_website/.env.production`:
```env
# Production environment variables
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com/api/v1
VITE_SITE_URL=https://your-domain.com
```

### 2. Update Vite Configuration
Ensure `indikriti_website/vite.config.js` includes:
```javascript
export default defineConfig({
  // ... existing config
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios']
        }
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  }
});
```

## 📊 Monitoring and Maintenance

### PM2 Monitoring
```bash
# View application status
pm2 status

# View logs
pm2 logs indikriti-website

# Restart application
pm2 restart indikriti-website

# Monitor resources
pm2 monit
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Deployment Updates

### Automated Update Script
Create `/var/www/indikriti/deploy.sh`:
```bash
#!/bin/bash
cd /var/www/indikriti
git pull origin main
cd indikriti_website
npm install
npm run build
pm2 restart indikriti-website
echo "Deployment completed successfully!"
```

Make it executable:
```bash
chmod +x /var/www/indikriti/deploy.sh
```

## 🧪 Testing Deployment

### 1. Test Application
```bash
curl -I http://your-domain.com
```

### 2. Performance Test
```bash
# Install Apache Bench
sudo apt install apache2-utils -y

# Test performance
ab -n 100 -c 10 http://your-domain.com/
```

## 🚨 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **PM2 application not starting**
   ```bash
   pm2 logs indikriti-website
   pm2 describe indikriti-website
   ```

4. **File permissions**
   ```bash
   sudo chown -R www-data:www-data /var/www/indikriti
   sudo chmod -R 755 /var/www/indikriti
   ```

## 📈 Performance Optimization

### 1. Enable HTTP/2 in Nginx
Add to server block:
```nginx
listen 443 ssl http2;
```

### 2. Configure Nginx Caching
```nginx
# Add to http block in /etc/nginx/nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                 inactive=60m use_temp_path=off;
```

### 3. PM2 Cluster Mode
Update ecosystem.config.js:
```javascript
instances: 'max', // Use all CPU cores
exec_mode: 'cluster'
```

## ✅ Final Checklist

- [ ] Server updated and secured
- [ ] Node.js and PM2 installed
- [ ] Application cloned and built
- [ ] PM2 configuration created
- [ ] Nginx configured and tested
- [ ] SSL certificate installed
- [ ] Domain pointing to server
- [ ] Application accessible via domain
- [ ] Monitoring setup
- [ ] Backup strategy implemented

## 📞 Support

For deployment issues:
1. Check application logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify server resources: `htop` or `pm2 monit`
4. Test connectivity: `curl -I http://localhost:3000`

---

**Note**: This deployment guide assumes the website runs independently without requiring backend API connectivity, using the built-in mock data functionality.
