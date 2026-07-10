<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;
use App\Services\OCR\TicketParserService;
use App\Services\OCR\ProductMatcherService;
use App\Models\Product;

class OCRController extends Controller
{
    public function scan(Request $request, TicketParserService $parser, ProductMatcherService $matcher)
    {
        $request->validate([
            'image' => 'required|image|max:10000'
        ]);

        $path = $request->file('image')->store('temp');

        $fullPath = storage_path('app/private/' . $path);

        $text = (new TesseractOCR($fullPath))
            ->executable('C:\\Program Files\\Tesseract-OCR\\tesseract.exe')
            ->lang('spa')
            ->run();

        $parsedProducts = $parser->parse($text);

        $matchedProducts = $matcher->match(
            $parsedProducts
        );

        return response()->json([
            'text' => $text,    
            'products' => $matchedProducts
        ]);
    }

    public function import(Request $request)
    {
        $products = $request->products;

        foreach ($products as $item) {

            if (!$item['matched']) {
            continue;
            }

            $productId = $item['matched_product']['id'];

            $product = Product::find($productId);

            if (!$product) {
            continue;
            }

            /*
            |--------------------------------------------------------------------------
            | ACTUALIZAR PRECIO
            |--------------------------------------------------------------------------
            */

            $product->price = $item['ocr_product']['price'];

            $product->save();

            /*
            |--------------------------------------------------------------------------
            | FUTURO:
            |--------------------------------------------------------------------------
            | - aumentar stock
            | - registrar compra
            | - guardar factura
            | - guardar proveedor
            */
        }

        return response()->json([
            'success' => true
        ]);
    }
}