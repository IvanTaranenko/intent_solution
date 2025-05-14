<?php

namespace Tests\Feature;

use App\Models\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RequestApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_request()
    {
        $payload = [
            'name' => 'John',
            'email' => 'john@example.com',
            'message' => 'This is a test message that is long enough.',
        ];

        $response = $this->postJson('/api/requests', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'John',
                'email' => 'john@example.com',
                'message' => 'This is a test message that is long enough.',
            ]);

        $this->assertDatabaseHas('requests', [
            'name' => 'John',
            'email' => 'john@example.com',
        ]);
    }

    /** @test */
    public function test_admin_can_update_request_status_with_token()
    {
        $request = Request::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'This is a test message',
            'status' => 'new',
        ]);

        $adminToken = env('ADMIN_TOKEN');

        $response = $this->withHeaders([
            'Authorization' => "Bearer $adminToken",
        ])->patchJson("/api/requests/{$request->id}", [
            'status' => 'approve',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'status' => 'approve',
        ]);
    }
}
