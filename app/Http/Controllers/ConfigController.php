<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConfigController extends Controller
{
    /**
     * Get essential frontend configuration based on environment.
     */
    public function getFrontendConfig(): JsonResponse
    {
        $isDevelopment = app()->environment('local', 'development');
        $environment = $isDevelopment ? 'development' : 'production';

        $config = [
            'api' => [
                'base_url' => config("frontend.api.base_url.{$environment}"),
            ],
            'websocket' => [
                'reverb' => [
                    'key' => config('frontend.websocket.reverb.key'),
                    'host' => config("frontend.websocket.reverb.host.{$environment}"),
                    'port' => config("frontend.websocket.reverb.port.{$environment}"),
                    'scheme' => config("frontend.websocket.reverb.scheme.{$environment}"),
                ],
            ],
            'paddle' => [
                'vendor_id' => config('frontend.paddle.vendor_id'),
                'product_id' => config('frontend.paddle.product_id'),
            ],
            'environment' => $environment,
        ];

        return response()->json($config);
    }

    /**
     * Get environment-specific configuration.
     */
    public function getEnvironmentConfig(): JsonResponse
    {
        $isDevelopment = app()->environment('local', 'development');
        
        return response()->json([
            'is_development' => $isDevelopment,
            'environment' => app()->environment(),
            'debug' => config('app.debug'),
        ]);
    }
} 