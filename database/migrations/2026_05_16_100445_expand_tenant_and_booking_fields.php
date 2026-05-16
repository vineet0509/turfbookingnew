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
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('state', 100)->nullable();
            $table->string('pincode', 10)->nullable();
            $table->string('banner_image')->nullable();
            $table->decimal('monthly_pass_price', 10, 2)->default(0);
            $table->integer('monthly_pass_bookings')->default(30);
            $table->json('amenities')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('whatsapp_number', 15)->nullable();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignUuid('pass_id')->nullable(); // If booked via monthly pass
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['state', 'pincode', 'banner_image', 'monthly_pass_price', 'monthly_pass_bookings', 'amenities', 'instagram_url', 'facebook_url', 'whatsapp_number']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('pass_id');
        });
    }
};
