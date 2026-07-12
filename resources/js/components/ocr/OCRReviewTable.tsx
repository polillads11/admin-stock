import { useState } from "react";
import axios from "axios";
import OCRProductSearch from "./OCRProductSearch";

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface MatchResult {
    ocr_product: {
        description: string;
        price: number;
    };

    matched_product: Product | null;

    score: number;
    matched: boolean;
}

interface Props {
    results: MatchResult[];
}

export default function OCRReviewTable({ results }: Props) {

    const [items, setItems] = useState(results);

    function updateProduct(index: number, product: Product) {

        const copy = [...items];

        copy[index] = {
            ...copy[index],
            matched_product: product,
            matched: true,
            score: 100,
        };

        setItems(copy);
    }

    async function confirmImport() {

        try {

            const response = await axios.post("/ocr/import", {
                products: items
            });

            alert("Importación realizada");

            console.log(response.data);

        } catch (error) {

            console.error(error);

            alert("Error al importar");
        }
    }

    return (

        <div className="space-y-4">

            <table className="w-full border">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="border p-2">
                            Producto OCR
                        </th>

                        <th className="border p-2">
                            Precio OCR
                        </th>

                        <th className="border p-2">
                            Producto seleccionado
                        </th>

                        <th className="border p-2">
                            Score
                        </th>

                        <th className="border p-2">
                            Estado
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {items.map((item, index) => (

                        <tr key={index}>

                            <td className="border p-2">
                                {item.ocr_product.description}
                            </td>

                            <td className="border p-2">
                                ${item.ocr_product.price}
                            </td>

                            <td className="border p-2">

                                {item.matched ? (

                                    <div>

                                        <div className="font-medium">
                                            {item.matched_product?.name}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            Coincidencia automática
                                        </div>

                                        <div className="mt-2">
                                            <OCRProductSearch
                                                onSelect={(product) =>
                                                    updateProduct(index, product)
                                                }
                                            />
                                        </div>

                                    </div>

                                ) : (

                                    <div>

                                        <div className="text-red-600 mb-2">
                                            Sin coincidencia
                                        </div>

                                        <OCRProductSearch
                                            onSelect={(product) =>
                                                updateProduct(index, product)
                                            }
                                        />

                                    </div>

                                )}

                            </td>

                            <td className="border p-2 text-center">
                                {item.score}%
                            </td>

                            <td className="border p-2 text-center">

                                {item.matched
                                    ? "✅"
                                    : "⚠️"}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            <button
                onClick={confirmImport}
                className="rounded bg-green-600 px-4 py-2 text-white"
            >
                Confirmar importación
            </button>

        </div>

    );
}