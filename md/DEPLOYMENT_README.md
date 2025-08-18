# 🚀 Indikriti Website - Production Deployment

This repository contains the complete setup for deploying the Indikriti website to a VPS server with PM2 and Nginx.

## 📁 Deployment Files

- `VPS_DEPLOYMENT_GUIDE.md` - Complete step-by-step deployment guide
- `ecosystem.config.js` - PM2 process management configuration
- `nginx-indikriti.conf` - Nginx server configuration
- `deploy.sh` - Automated deployment script
- `indikriti_website/.env.production.template` - Production environment template

## 🎯 Quick Start

### 1. Prepare Your VPS
- Ubuntu/Debian server with 2GB+ RAM
- Root or sudo access
- Domain name pointed to server IP

### 2. Run Automated Deployment
```bash
# Clone repository
git clone https://github.com/your-username/indikriti.git
cd indikriti

# Make deployment script executable
chmod +x deploy.sh

# Run deployment (will install all dependencies)
./deploy.sh
```

### 3. Configure Domain
Update the following files with your domain:
- `nginx-indikriti.conf` - Replace `your-domain.com`
- `ecosystem.config.js` - Update environment variables

### 4. Setup SSL (Optional)
The deployment script will prompt for SSL setup using Let's Encrypt.

## 🔧 Manual Deployment

If you prefer manual deployment, follow the detailed guide in `VPS_DEPLOYMENT_GUIDE.md`.

## 📊 Key Features

### ✅ Website Features
- **Public Access**: No authentication required
- **Mock Data**: Works without backend API
- **Responsive Design**: Mobile-first approach
- **Fast Loading**: Optimized build with code splitting
- **SEO Friendly**: Meta tags and structured data

### ✅ Infrastructure Features
- **PM2 Process Management**: Auto-restart, clustering, monitoring
- **Nginx Reverse Proxy**: Load balancing, SSL termination, caching
- **SSL/HTTPS**: Automatic certificate management with Let's Encrypt
- **Security Headers**: XSS protection, CSRF prevention, content security
- **Gzip Compression**: Reduced bandwidth usage
- **Rate Limiting**: DDoS protection
- **Health Monitoring**: Application and server health checks

## 🛠️ Configuration

### Environment Variables
Copy and configure the production environment:
```bash
cp indikriti_website/.env.production.template indikriti_website/.env.production
```

Edit the values according to your setup:
- `VITE_SITE_URL`: Your website domain
- `VITE_API_URL`: Backend API URL (optional)
- Contact information and social media links

### PM2 Configuration
The `ecosystem.config.js` file configures:
- Process management
- Environment variables
- Logging
- Health monitoring
- Deployment hooks

### Nginx Configuration
The `nginx-indikriti.conf` file provides:
- SSL/HTTPS setup
- Static file serving
- Proxy configuration
- Security headers
- Rate limiting
- Gzip compression

## 📈 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Vendor and utility chunks
- **Tree Shaking**: Remove unused code
- **Minification**: Compressed JavaScript and CSS
- **Image Optimization**: WebP and AVIF support
- **Caching**: Long-term caching for static assets

### Server Optimizations
- **HTTP/2**: Faster multiplexed connections
- **Gzip Compression**: Reduced transfer sizes
- **Static File Caching**: Browser and proxy caching
- **Keep-Alive Connections**: Reduced connection overhead

## 🔍 Monitoring

### PM2 Monitoring
```bash
# Check application status
pm2 status

# View logs
pm2 logs indikriti-website

# Monitor resources
pm2 monit

# Restart application
pm2 restart indikriti-website
```

### Nginx Monitoring
```bash
# Check Nginx status
sudo systemctl status nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### System Monitoring
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h
```

## 🔄 Updates and Maintenance

### Automated Updates
Use the deployment script for updates:
```bash
./deploy.sh
```

### Manual Updates
```bash
# Pull latest code
git pull origin main

# Rebuild application
cd indikriti_website
npm install
npm run build

# Restart PM2
pm2 restart indikriti-website
```

### Backup Strategy
The deployment script automatically creates backups in `/var/backups/indikriti/`.

## 🚨 Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   pm2 logs indikriti-website
   pm2 describe indikriti-website
   ```

2. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

4. **Port conflicts**
   ```bash
   sudo lsof -i :3000
   sudo netstat -tulpn | grep :3000
   ```

### Performance Issues

1. **High memory usage**
   - Check PM2 memory limits
   - Monitor with `pm2 monit`
   - Consider cluster mode

2. **Slow response times**
   - Check Nginx logs
   - Monitor server resources
   - Optimize static file caching

## 📞 Support

### Log Locations
- Application logs: `/var/log/pm2/indikriti-website.log`
- Nginx access logs: `/var/log/nginx/access.log`
- Nginx error logs: `/var/log/nginx/error.log`
- Deployment logs: `/var/log/indikriti-deploy.log`

### Health Checks
- Application: `curl http://localhost:3000`
- Nginx: `curl http://your-domain.com/health`
- SSL: `curl -I https://your-domain.com`

## 🎉 Success Checklist

After deployment, verify:
- [ ] Website loads at your domain
- [ ] HTTPS certificate is active
- [ ] All pages are accessible
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Search functionality works
- [ ] Mobile responsiveness
- [ ] Page load speed < 3 seconds
- [ ] PM2 application is running
- [ ] Nginx is serving requests
- [ ] SSL certificate auto-renewal is configured

---

**Note**: This deployment setup is optimized for the Indikriti website running as a standalone application with mock data. No backend API is required for basic functionality.
