<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('paddle_subscription_id')->unique()->nullable(); // Paddle subscription ID
            $table->string('paddle_customer_id')->nullable(); // Paddle customer ID
            $table->string('plan_name'); // e.g., "basic", "premium", "pro"
            $table->string('plan_type'); // e.g., "monthly", "yearly"
            $table->integer('amount'); // Amount in cents
            $table->string('currency')->default('USD');
            $table->string('status'); // e.g., "active", "cancelled", "paused", "past_due"
            $table->timestamp('trial_ends_at')->nullable(); // Trial end date
            $table->timestamp('current_period_start')->nullable(); // Current billing period start
            $table->timestamp('current_period_end')->nullable(); // Current billing period end
            $table->timestamp('cancelled_at')->nullable(); // When subscription was cancelled
            $table->timestamp('ends_at')->nullable(); // When subscription will end (for cancelled subscriptions)
            $table->boolean('auto_renew')->default(true); // Whether subscription auto-renews
            $table->json('features')->nullable(); // JSON object of subscription features
            $table->text('cancellation_reason')->nullable(); // Reason for cancellation
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['user_id', 'status']);
            $table->index('paddle_subscription_id');
            $table->index('paddle_customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
