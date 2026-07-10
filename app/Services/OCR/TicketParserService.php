<?php

namespace App\Services\OCR;

class TicketParserService
{
    /**
     * Palabras que NO representan productos
     */
    protected array $ignoreWords = [
        'TOTAL',
        'SUBTOTAL',
        'IVA',
        'RECIBI',
        'EFECTIVO',
        'CUIT',
        'FECHA',
        'CONSUMIDOR',
        'RESPONSABLE',
        'TRANSPARENCIA',
        'PROTECCIÓN',
        'REGIMEN',
        'COD.',
        'P.V.',
        'NRO.',
        'HORA',
        'BOLSA',
    ];

    /**
     * Parsea texto OCR y devuelve productos detectados
     */
    public function parse(string $text): array
    {
        $lines = preg_split('/\r\n|\r|\n/', $text);

        $products = [];

        foreach ($lines as $line) {

            $line = trim($line);

            if (empty($line)) {
                continue;
            }

            // Ignorar líneas cortas
            if (mb_strlen($line) < 5) {
                continue;
            }

            // Ignorar líneas del sistema
            if ($this->shouldIgnore($line)) {
                continue;
            }

            /**
             * Detectar:
             *
             * TEXTO .... 1234,00
             */
            if (
                preg_match(
                    '/^(.+?)\s+(\d+[.,]\d{2})$/',
                    $line,
                    $matches
                )
            ) {

                $description = trim($matches[1]);

                $price = $matches[2];

                // Limpiar descripción
                $description = $this->cleanDescription($description);

                // Convertir precio
                $price = $this->normalizePrice($price);

                // Validaciones mínimas
                if (
                    empty($description) ||
                    $price <= 0
                ) {
                    continue;
                }

                $products[] = [
                    'description' => $description,
                    'price' => $price,
                ];
            }
        }

        return $products;
    }

    /**
     * Ignorar líneas irrelevantes
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
     * Limpiar descripción producto
     */
    protected function cleanDescription(string $description): string
    {
        $description = mb_strtoupper($description);

        // Reemplazos comunes OCR
        $description = str_replace('*', ' ', $description);

        // Quitar múltiples espacios
        $description = preg_replace('/\s+/', ' ', $description);

        return trim($description);
    }

    /**
     * Convierte:
     * 3.500,00
     * 3500,00
     * 3500.00
     *
     * → 3500.00
     */
    protected function normalizePrice(string $price): float
    {
        // quitar separador miles
        $price = str_replace('.', '', $price);

        // coma decimal → punto
        $price = str_replace(',', '.', $price);

        return (float) $price;
    }
}

