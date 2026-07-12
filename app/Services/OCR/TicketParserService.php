<?php

namespace App\Services\OCR;

class TicketParserService
{
    /**
     * Palabras que indican que la línea NO es un producto.
     */
    protected array $ignoreWords = [

        'TOTAL',
        'SUBTOTAL',
        'DESCUENTO',
        'PROMOCION',
        'PROMOCIÓN',

        'IVA',
        'CUIT',
        'RESPONSABLE',
        'CONSUMIDOR',
        'TRANSPARENCIA',
        'REGIMEN',
        'RÉGIMEN',
        'PROTECCIÓN',

        'RECIBI',
        'EFECTIVO',
        'TARJETA',
        'CAMBIO',

        'FECHA',
        'HORA',
        'INICIO',
        'ACTIVIDADES',
        'DIRECCION',
        'DIRECCIÓN',

        'COD.',
        'CODIGO',
        'P.V.',
        'NRO',
        'TIQUE',

        'SESHIA',
    ];

    /**
     * Devuelve únicamente los productos encontrados.
     */
    public function parse(string $text): array
    {
        $lines = preg_split('/\r\n|\r|\n/', $text);

        $products = [];

        foreach ($lines as $line) {

            $line = trim($line);

            if ($line === '') {
                continue;
            }

            if (mb_strlen($line) < 4) {
                continue;
            }

            if ($this->shouldIgnore($line)) {
                continue;
            }

            /*
             * Busca el ÚLTIMO importe de la línea.
             *
             * Ejemplos:
             *
             * COCA COLA           2300,00
             * COCA COLA        $ 2.300,00
             * COCA COLA.........2300,00
             */

            if (!preg_match(
                '/^(.*?)(?:\s+\$?\s*)([\d\.]+,\d{2})$/u',
                $line,
                $matches
            )) {
                continue;
            }

            $description = $this->cleanDescription($matches[1]);

            $price = $this->normalizePrice($matches[2]);

            if ($description === '') {
                continue;
            }

            if ($price <= 0) {
                continue;
            }

            /*
             * Evita líneas como:
             *
             * 2.000 x 1.500,00
             * 0.100 x 15.400,00
             */

            if (preg_match('/^\d+[.,]?\d*\s*x\s*\d+/i', $description)) {
                continue;
            }

            $products[] = [
                'description' => $description,
                'price' => $price,
            ];
        }

        return $products;
    }

    /**
     * Determina si la línea pertenece al encabezado o pie.
     */
    protected function shouldIgnore(string $line): bool
    {
        $upper = mb_strtoupper($line);

        foreach ($this->ignoreWords as $word) {

            if (str_contains($upper, $word)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Limpia el nombre del producto.
     */
    protected function cleanDescription(string $description): string
    {
        $description = mb_strtoupper($description);

        // Caracteres frecuentes del OCR
        $description = str_replace(
            [
                '*',
                '$',
                '=',
                '.',
                ':',
                ';',
                ',',
                '_',
                '|',
                '(',
                ')'
            ],
            ' ',
            $description
        );

        // Eliminar espacios múltiples
        $description = preg_replace('/\s+/', ' ', $description);

        return trim($description);
    }

    /**
     * Convierte:
     *
     * 3.500,00
     * 3500,00
     * $3.500,00
     *
     * a
     *
     * 3500.00
     */
    protected function normalizePrice(string $price): float
    {
        $price = preg_replace('/[^\d,\.]/', '', $price);

        $price = str_replace('.', '', $price);

        $price = str_replace(',', '.', $price);

        return (float) $price;
    }
}
