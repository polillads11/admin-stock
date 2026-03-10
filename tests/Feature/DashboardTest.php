<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

// verify cash statistics are provided in the dashboard payload

test('dashboard response contains cash statistics', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))
         ->assertInertia(fn ($page) =>
             $page->where('totalIncomes', 0)
                  ->where('totalExpenses', 0)
                  ->where('netCash', 0)
         );
});

// the user filter should restrict cash movements used in the calculation

test('cash statistics respect user filter', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    // create movements for each
    \App\Models\CashMovement::create([ 'type' => 'ingreso', 'amount' => 100, 'user_id' => $userA->id ]);
    \App\Models\CashMovement::create([ 'type' => 'egreso', 'amount' => 30, 'user_id' => $userB->id ]);

    $this->actingAs($userA);
    $this->get(route('dashboard', ['user_id' => $userA->id]))
         ->assertInertia(fn ($page) =>
             $page->where('totalIncomes', 100)
                  ->where('totalExpenses', 0)
         );
});