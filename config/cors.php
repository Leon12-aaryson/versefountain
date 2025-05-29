<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Only apply CORS to API routes
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    // Allow all origins in development, restrict in production
    'allowed_origins' => env('APP_ENV') === 'production'
        ? ['https://versefountain.com']
        : ['http://localhost:5174', 'http://127.0.0.1:5174', '*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
