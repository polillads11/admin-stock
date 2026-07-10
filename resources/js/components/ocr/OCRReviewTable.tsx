import { useState } from "react";
import axios from "axios";

interface MatchResult {
    ocr_product: {
        description: string;
        price: number;
    };

    matched_product: {
        id: number;
        name: string;
        price: number;
    } | null;

    score: number;
    matched: boolean;
}

interface Props {
    results: MatchResult[];
}

export default function OCRReviewTable({ results }: Props) {

    const [items, setItems] = useState(results);

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
                        <th className="p-2 border">Producto OCR</th>
                        <th className="p-2 border">Precio OCR</th>
                        <th className="p-2 border">Producto encontrado</th>
                        <th className="p-2 border">Score</th>
                        <th className="p-2 border">Estado</th>
                    </tr>

                </thead>

                <tbody>

                    {items.map((item, index) => (

                        <tr key={index}>

                            <td className="p-2 border">
                                {item.ocr_product.description}
                            </td>

                            <td className="p-2 border">
                                ${item.ocr_product.price}
                            </td>

                            <td className="p-2 border">

                                {item.matched_product
                                    ? item.matched_product.name
                                    : "Sin coincidencia"}

                            </td>

                            <td className="p-2 border">
                                {item.score}%
                            </td>

                            <td className="p-2 border">

                                {item.matched
                                    ? "✅"
                                    : "⚠️ Revisar"}

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

            <button
                onClick={confirmImport}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Confirmar Importación
            </button>

        </div>
    );
}