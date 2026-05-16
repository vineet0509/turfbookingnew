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
        Schema::create('turf_grounds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('turf_type', ['cricket', 'football', 'badminton', 'multi'])->default('cricket');
            $table->text('description')->nullable();
            $table->integer('capacity')->default(22);
            $table->string('pitch_type')->nullable();
            $table->decimal('price_per_hour', 10, 2)->default(0);
            $table->decimal('weekend_price_per_hour', 10, 2)->default(0);
            $table->json('images')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turf_grounds');
    }
};
