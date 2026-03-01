// Mobile app environment configuration
// Automatically switches between development and production

import Constants from 'expo-constants'

const isDevelopment =
  Constants.expoConfig?.extra?.env === 'development' ||
  process.env.EXPO_PUBLIC_ENV === 'development'

// IMPORTANT: Update this with YOUR actual domain
const PRODUCTION_DOMAIN = process.env.EXPO_PUBLIC_DOMAIN || 'yourdomain.com';
const PRODUCTION_API_DOMAIN = process.env.EXPO_PUBLIC_API_DOMAIN || `api.${PRODUCTION_DOMAIN}`;

export const config = {
  // API URL - switches based on environment
  api: {
    baseUrl: isDevelopment
      ? process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'
      : `https://${PRODUCTION_API_DOMAIN}`,
    timeout: 30000, // 30 seconds
  },

  // Content/frontend URL
  content: {
    baseUrl: isDevelopment
      ? process.env.EXPO_PUBLIC_CONTENT_URL || 'http://localhost:3000'
      : `https://${PRODUCTION_DOMAIN}`,
  },

  // Environment
  environment: isDevelopment ? 'development' : 'production',

  // Debug logging
  debug: isDevelopment,

  // SSL settings
  ssl: {
    verify: !isDevelopment, // Don't verify self-signed certs in dev
  },
};

// Export for easy use
export const API_URL = config.api.baseUrl;
export const CONTENT_URL = config.content.baseUrl;
export const ENVIRONMENT = config.environment;

console.log(`[Config] Environment: ${config.environment}`);
console.log(`[Config] API URL: ${config.api.baseUrl}`);
console.log(`[Config] Content URL: ${config.content.baseUrl}`);
