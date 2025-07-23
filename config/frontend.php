<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Frontend Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration file contains essential settings that are served
    | to the frontend via API for security and maintainability.
    |
    */

    'api' => [
        'base_url' => [
            'development' => env('FRONTEND_API_BASE_URL_DEV', 'http://127.0.0.1:8001'),
            'production' => env('FRONTEND_API_BASE_URL_PROD', 'https://api.versefountain.com'),
        ],
    ],

    'websocket' => [
        'reverb' => [
            'key' => env('REVERB_APP_KEY', 'iuyyh4goq2x7wssodhtc'),
            'host' => [
                'development' => env('REVERB_HOST_DEV', 'localhost'),
                'production' => env('REVERB_HOST_PROD', 'api.versefountain.com'),
            ],
            'port' => [
                'development' => env('REVERB_PORT_DEV', 8080),
                'production' => env('REVERB_PORT_PROD', 443),
            ],
            'scheme' => [
                'development' => env('REVERB_SCHEME_DEV', 'http'),
                'production' => env('REVERB_SCHEME_PROD', 'https'),
            ],
        ],
    ],

    'paddle' => [
        'vendor_id' => env('PADDLE_VENDOR_ID'),
        'product_id' => env('PADDLE_PRODUCT_ID'),
    ],
]; 