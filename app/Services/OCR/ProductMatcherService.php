<?php

namespace App\Services\OCR;

use App\Models\Product;

class ProductMatcherService
{
    public function match(array $ocrProducts): array
    {
        $products = Product::all();

        $results = [];

        foreach ($ocrProducts as $ocrProduct) {

            $bestMatch = null;

            $bestScore = 0;

            $ocrName = $this->normalize(
                $ocrProduct['description']
            );

            foreach ($products as $product) {

                $dbName = $this->normalize(
                    $product->name
                );

                similar_text(
                    $ocrName,
                    $dbName,
                    $percent
                );

                if ($percent > $bestScore) {

                    $bestScore = $percent;

                    $bestMatch = $product;
                }
            }

            $results[] = [
                'ocr_product' => $ocrProduct,
                'matched_product' => $bestMatch,
                'score' => round($bestScore, 2),
                'matched' => $bestScore >= 70,
            ];
        }

        return $results;
    }

    protected function normalize(string $text): string
    {
        $text = mb_strtolower($text);

        $replacements = [
            '*' => ' ',
            'cm' => 'ml',
            'clasic' => 'classic',
            'coca cola' => 'cocacola',
            'sin azucar' => 'sin',
        ];

        $text = str_replace(
            array_keys($replacements),
            array_values($replacements),
            $text
        );

        $text = preg_replace('/(\d+)(ml)/', '$1 ml', $text);

        $text = preg_replace('/[^a-z0-9\s]/', ' ', $text);

        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }
}