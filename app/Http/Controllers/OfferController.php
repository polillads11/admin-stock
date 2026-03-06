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
        return Inertia::render('Offers/Create');
    }

    public function store(OfferRequest $request)
    {
        Offer::create($request->validated());

        return redirect()->route('offers.index')->with('success', 'Oferta creada correctamente.');
    }

    public function show(Offer $offer)
    {
        return Inertia::render('Offers/Show', [
            'offer' => $offer,
        ]);
    }

    public function edit(Offer $offer)
    {
        return Inertia::render('Offers/Edit', [
            'offer' => $offer,
        ]);
    }

    public function update(OfferRequest $request, Offer $offer)
    {
        $offer->update($request->validated());

        return redirect()->route('offers.index')->with('success', 'Oferta actualizada correctamente.');
    }

    public function destroy(Offer $offer)
    {
        $offer->delete();

        return redirect()->back()->with('success', 'Oferta eliminada.');
    }
}
