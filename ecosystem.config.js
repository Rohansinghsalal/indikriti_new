/**
 * PM2 Ecosystem Configuration for Indikriti Website
 * This file configures PM2 process management for production deployment
 */

module.exports = {
  apps: [
    {
      // Application configuration
      name: 'indikriti-website',
      script: 'npm',
      args: 'run preview',
      cwd: '/var/www/indikriti/indikriti_website',
      
      // Process management
      instances: 1, // Single instance for small VPS, change to 'max' for cluster mode
      exec_mode: 'fork', // Use 'cluster' for multiple instances
      autorestart: true,
      watch: false, // Disable file watching in production
      max_memory_restart: '1G',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        VITE_API_URL: process.env.VITE_API_URL || null, // Optional backend API
        VITE_SITE_URL: process.env.VITE_SITE_URL || 'http://localhost:3000'
      },
      
      // Logging
      log_file: '/var/log/pm2/indikriti-website.log',
      out_file: '/var/log/pm2/indikriti-website-out.log',
      error_file: '/var/log/pm2/indikriti-website-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced options
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true
    }
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/indikriti.git',
      path: '/var/www/indikriti',
      'pre-deploy-local': '',
      'post-deploy': 'cd indikriti_website && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
};
