<?php

use App\Models\Product;
use App\Models\Local;
use App\Models\ProductLocalStock;
use App\Models\User;

beforeEach(function () {
    // each test starts with a logged-in user
    $this->actingAs(User::factory()->create());
});

it('redirects to local creation when no locales exist', function () {
    // ensure products table has an entry so we can request the route
    $product = Product::create([
        'sku' => 'P100',
        'name' => 'Test product',
        'price' => 10,
    ]);

    $response = $this->get(route('products.stock', $product->id));

    $response->assertRedirect(route('locals.create'))
             ->assertSessionHas('error', 'Debe crear al menos un local antes de gestionar el stock.');

    // after redirection, flash error should be present on the Inertia page
    $response2 = $this->get(route('locals.create'));

    // if the user doesn't have permission to create a local, we expect a 403
    if ($response2->getStatusCode() === 403) {
        $response2->assertSee('User does not have the right permissions');
    } else {
        $response2->assertInertia(fn ($page) =>
            $page->where('flash.error', 'Debe crear al menos un local antes de gestionar el stock.')
        );
    }
});

it('allows editing stock when at least one local exists', function () {
    $local = Local::create([ 'name' => 'Main branch' ]);
    $product = Product::create([
        'sku' => 'P101',
        'name' => 'Another product',
        'price' => 5,
    ]);

    // create pivot record so the view has something
    ProductLocalStock::create([
        'product_id' => $product->id,
        'local_id' => $local->id,
        'stock' => 0,
    ]);

    $this->get(route('products.stock', $product->id))
         ->assertOk()
         ->assertInertia(fn ($page) =>
             $page->where('product.id', $product->id)
         );
});
