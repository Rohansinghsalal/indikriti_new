/**
 * Development startup script
 * Runs both frontend and backend servers concurrently
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Determine if we're on Windows
const isWindows = os.platform() === 'win32';

// Function to run a command
const runCommand = (command, args, cwd, name) => {
  console.log(`Starting ${name}...`);
  
  const childProcess = spawn(
    isWindows ? 'cmd' : 'sh',
    isWindows ? ['/c', command, ...args] : ['-c', `${command} ${args.join(' ')}`],
    {
      cwd,
      stdio: 'pipe',
      shell: true
    }
  );

  childProcess.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });

  childProcess.on('error', (error) => {
    console.error(`[${name}] Error: ${error.message}`);
  });

  childProcess.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  return childProcess;
};

// Check if .env file exists, if not create it with default values
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  console.log('Creating default .env file for backend...');
  const defaultEnv = `
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d
JWT_RESET_SECRET=your_jwt_reset_secret_key
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=admin_panel
DB_DIALECT=mysql
`;
  fs.writeFileSync(backendEnvPath, defaultEnv.trim());
}

// Start backend server
const backendPath = path.join(__dirname, 'backend');
const backendProcess = runCommand('npm', ['run', 'dev'], backendPath, 'Backend');

// Start frontend server
const frontendPath = path.join(__dirname, 'frontend');
const frontendProcess = runCommand('npm', ['run', 'dev'], frontendPath, 'Frontend');

// Handle process termination
const handleExit = () => {
  console.log('Shutting down servers...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit); 