import { useEffect, useState } from "react";
import axios from "axios";
import { route } from "ziggy-js";

type Product = {
    id: number;
    name: string;
    sku: string;
    price: number;
};

type Props = {
    onSelect: (product: Product) => void;
};

export default function OCRProductSearch({ onSelect }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    route("ocr.search-product"),
                    {
                        params: {
                            q: query,
                        },
                    }
                );

                setResults(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="space-y-2">

            <input
                type="text"
                className="w-full rounded border p-2"
                placeholder="Buscar producto..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && (
                <div className="text-sm text-gray-500">
                    Buscando...
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="max-h-60 overflow-auto rounded border">

                    {results.map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                                onSelect(product);
                                setQuery(product.name);
                                setResults([]);
                            }}
                            className="block w-full border-b p-2 text-left hover:bg-gray-100"
                        >
                            <div className="font-medium">
                                {product.name}
                            </div>

                            <div className="text-xs text-gray-500">
                                SKU: {product.sku}
                            </div>

                            <div className="text-xs">
                                ${product.price}
                            </div>
                        </button>
                    ))}

                </div>
            )}

        </div>
    );
}