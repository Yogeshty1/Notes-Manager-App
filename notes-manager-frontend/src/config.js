// API Configuration
// This file manages the backend API URL for different environments

const config = {
  // Development API URL (local backend)
  development: 'http://localhost:3001',
  
  // Production API URL (will be updated after backend deployment)
  production: 'https://your-backend-url.vercel.app', // UPDATE THIS AFTER BACKEND DEPLOYMENT
  
  // Get current environment
  getCurrentEnv: () => {
    return process.env.NODE_ENV || 'development';
  },
  
  // Get API base URL based on environment
  getApiUrl: () => {
    const env = config.getCurrentEnv();
    return config[env] || config.development;
  },
  
  // Get full API endpoint URL
  getApiEndpoint: (endpoint) => {
    const baseUrl = config.getApiUrl();
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
};

export default config;
