import { API_BASE_URL, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '../../config/api';
import config from '../../config/environment';

/**
 * HTTP Service
 * Utility service for making HTTP requests
 */
class HttpService {
  /**
   * Make a GET request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  static async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }
  
  /**
   * Make a POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  static async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * Make a PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  static async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * Make a PATCH request
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  static async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * Make a DELETE request
   * @param {string} url - Request URL
   * @param {Object} data - Request body (optional)
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  static async delete(url, data = null, options = {}) {
    const requestOptions = {
      ...options,
      method: 'DELETE',
    };
    
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }
    
    return this.request(url, requestOptions);
  }
  
  /**
   * Make an HTTP request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  static async request(url, options = {}) {
    try {
      const { headers, ...restOptions } = options;
      
      // Get auth token if available
      const token = localStorage.getItem('token');
      const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Prepare request options
      const requestOptions = {
        ...restOptions,
        headers: {
          ...DEFAULT_HEADERS,
          ...authHeader,
          ...headers,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      };
      
      // Make the request
      const response = await fetch(url.startsWith('http') ? url : `${API_BASE_URL}${url}`, requestOptions);
      
      // Handle response
      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        
        const error = new Error(errorData.message || 'Request failed');
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      // Check if response is empty
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('HTTP request failed:', error);
      throw error;
    }
  }
}

export default HttpService;