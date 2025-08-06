#!/bin/bash

echo "🚀 VerseFountain Quick Start Script"
echo "=================================="

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.2+ first."
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Setting up environment file..."
    cp .env.example .env
    php artisan key:generate
fi

# Run database migrations
echo "🗄️ Setting up database..."
php artisan migrate

# Build frontend assets
echo "🎨 Building frontend assets..."
npm run build

echo ""
echo "🎉 Setup complete! Starting development server..."
echo "🌐 Application will be available at: http://localhost:8000"
echo "📱 You can now:"
echo "   - Register a new account"
echo "   - Create your first poem"
echo "   - Explore the poetry platform"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
php artisan serve 