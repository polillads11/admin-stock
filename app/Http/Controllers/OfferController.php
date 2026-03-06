<?php

namespace App\Http\Controllers;

use App\Http\Requests\OfferRequest;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $offers = Offer::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->withCount('products')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Offers/Index', [
            'offers' => $offers,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $products = \App\Models\Product::select('id', 'name')->get();
        return Inertia::render('Offers/Create', [
            'products' => $products,
        ]);
    }

    public function store(OfferRequest $request)
    {
        $data = $request->validated();
        $offer = Offer::create($data);

        if (!empty($data['products'])) {
            $sync = [];
            foreach ($data['products'] as $p) {
                $sync[$p['id']] = ['quantity' => $p['quantity'] ?? 1];
            }
            $offer->products()->sync($sync);
        }

        return redirect()->route('offers.index')->with('success', 'Oferta creada correctamente.');
    }

    public function show(Offer $offer)
    {
        $offer->load('products');
        return Inertia::render('Offers/Show', [
            'offer' => $offer,
        ]);
    }

    public function edit(Offer $offer)
    {
        $offer->load('products');
        $products = \App\Models\Product::select('id', 'name')->get();
        return Inertia::render('Offers/Edit', [
            'offer' => $offer,
            'products' => $products,
        ]);
    }

    public function update(OfferRequest $request, Offer $offer)
    {
        $data = $request->validated();
        $offer->update($data);

        if (!empty($data['products'])) {
            $sync = [];
            foreach ($data['products'] as $p) {
                $sync[$p['id']] = ['quantity' => $p['quantity'] ?? 1];
            }
            $offer->products()->sync($sync);
        } else {
            $offer->products()->detach();
        }

        return redirect()->route('offers.index')->with('success', 'Oferta actualizada correctamente.');
    }

    public function destroy(Offer $offer)
    {
        $offer->delete();

        return redirect()->back()->with('success', 'Oferta eliminada.');
    }
}
