export const configs = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  ENV: process.env.NODE_ENV || 'development',
  VERSION: process.env.REACT_APP_VERSION || '1',
};

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
