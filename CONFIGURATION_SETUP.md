# Essential Configuration Setup Guide

This guide explains how to set up the simplified configuration system that provides essential frontend settings from the backend for better security and maintainability.

## Overview

The application now uses a streamlined configuration system where:
- **Backend**: Stores essential configuration in `.env` file and serves it via API
- **Frontend**: Fetches only essential configuration from backend API
- **Focus**: API URL, WebSocket settings, and payment authentication

## Backend Setup

### 1. Environment Variables

Create a `.env` file in the `versefountain-backend` directory with these essential variables:

```env
# API Configuration
FRONTEND_API_BASE_URL_DEV="http://127.0.0.1:8001"
FRONTEND_API_BASE_URL_PROD="https://api.versefountain.com"

# WebSocket Configuration
REVERB_APP_KEY="iuyyh4goq2x7wssodhtc"
REVERB_HOST_DEV="localhost"
REVERB_HOST_PROD="api.versefountain.com"
REVERB_PORT_DEV=8080
REVERB_PORT_PROD=443
REVERB_SCHEME_DEV="http"
REVERB_SCHEME_PROD="https"

# Payment Configuration
PADDLE_VENDOR_ID=your_paddle_vendor_id
PADDLE_PRODUCT_ID=your_paddle_product_id
```

### 2. Configuration Files

The system uses these files:
- `config/frontend.php` - Laravel config file that reads from `.env`
- `app/Http/Controllers/ConfigController.php` - API controller that serves config
- `routes/api.php` - Routes for config endpoints

### 3. API Endpoints

Two endpoints are available:
- `GET /api/config/frontend` - Returns essential frontend configuration
- `GET /api/config/environment` - Returns environment information

## Frontend Setup

### 1. Configuration Context

The frontend uses:
- `src/contexts/ConfigContext.tsx` - Fetches and manages essential configuration
- `src/constants/constants.tsx` - Simplified with `useAppConfig()` hook
- `src/App.tsx` - Wrapped with `ConfigProvider`

### 2. Usage

Use the `useAppConfig` hook to access essential configuration:

```tsx
import { useAppConfig } from '@/constants/constants';

function MyComponent() {
  const { 
    apiBaseUrl, 
    reverbConfig, 
    paddleConfig, 
    environment 
  } = useAppConfig();
  
  // Use the configuration values
}
```

### 3. Fallback Configuration

If the backend is unavailable, the frontend falls back to hardcoded values for development.

## Essential Configuration

### What's Included

✅ **API Configuration**
- Base URL for API requests

✅ **WebSocket Configuration**
- Reverb key, host, port, and scheme
- Environment-specific settings

✅ **Payment Configuration**
- Paddle vendor ID and product ID
- Payment authentication settings

### What's Removed

❌ **Application Settings** (moved to component-level)
- App name, language settings
- Pagination limits, character limits
- Feature flags and UI settings

## Benefits

### Security
- Sensitive configuration (API keys, secrets) stays on backend
- Frontend only receives essential settings
- No hardcoded secrets in frontend code

### Simplicity
- Focused on essential configuration only
- Reduced complexity and maintenance overhead
- Clear separation of concerns

### Maintainability
- Single source of truth for essential settings
- Environment-specific configuration
- Easy to update without frontend deployment

## Migration Guide

### For Existing Components

1. **Replace direct imports**:
   ```tsx
   // Old
   import { API_BASE_URL, REVERB_CONFIG } from '@/constants/constants';
   
   // New
   import { useAppConfig } from '@/constants/constants';
   ```

2. **Use the hook**:
   ```tsx
   // Old
   const apiUrl = API_BASE_URL;
   
   // New
   const { apiBaseUrl } = useAppConfig();
   ```

3. **Handle loading states**:
   ```tsx
   const { apiBaseUrl, isLoading, error } = useAppConfig();
   
   if (isLoading) return <div>Loading...</div>;
   if (error) return <div>Error: {error}</div>;
   ```

### For Application Settings

Move application-specific settings to component level or create separate configuration files:

```tsx
// Component-level constants
const ITEMS_PER_PAGE = 20;
const MAX_TITLE_LENGTH = 100;

// Or create separate config files
import { APP_CONFIG } from '@/config/app-config';
```

## Testing

### Backend Testing

Test the configuration endpoints:
```bash
curl http://localhost:8001/api/config/frontend
curl http://localhost:8001/api/config/environment
```

### Frontend Testing

Visit `/config-test` to see the essential configuration system in action.

## Troubleshooting

### Common Issues

1. **Configuration not loading**: Check that the backend is running and accessible
2. **Wrong environment detected**: Verify the hostname detection logic
3. **Missing environment variables**: Ensure all required variables are set in `.env`

### Debug Mode

Enable debug mode to see configuration loading:
```tsx
const { config, environment, isLoading, error } = useConfig();
console.log('Config:', config);
console.log('Environment:', environment);
``` 