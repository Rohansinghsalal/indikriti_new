/**
 * Script to run the hierarchy test
 */

const { exec } = require('child_process');

console.log('Installing axios if not already installed...');
exec('npm install axios', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing axios: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(`stdout: ${stdout}`);
  
  console.log('Running hierarchy test...');
  exec('node test-hierarchy.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running test: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`Test output: ${stdout}`);
  });
});