// Environment configuration for VIKSIT KANPUR UI
// This is a UI-only project without backend dependencies

export const config = {
  // App configuration
  APP_NAME: 'VIKSIT KANPUR',
  APP_VERSION: '1.0.0',
  
  // UI configuration
  DEFAULT_LANGUAGE: 'hindi' as const,
  SUPPORTED_LANGUAGES: ['hindi', 'english'] as const,
  
  // Mock data configuration
  MOCK_DELAY_MS: 1000,
  ENABLE_MOCK_ANIMATIONS: true,
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';