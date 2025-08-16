/**
 * Test authentication using axios
 */
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1/auth/login';
const credentials = {
  email: 'admin@example.com',
  password: 'admin123'
};

console.log('Sending request to:', API_URL);
console.log('With credentials:', JSON.stringify(credentials));

axios.post(API_URL, credentials)
  .then(response => {
    console.log('STATUS:', response.status);
    console.log('HEADERS:', JSON.stringify(response.headers, null, 2));
    console.log('RESPONSE DATA:', JSON.stringify(response.data, null, 2));
    
    if (response.data.token) {
      console.log('\nAUTHENTICATION SUCCESSFUL!');
      console.log('Token:', response.data.token);
    } else {
      console.log('\nAUTHENTICATION FAILED: No token in response');
    }
  })
  .catch(error => {
    console.error('REQUEST ERROR:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  });

console.log('Request sent, waiting for response...');