import { useState } from "react";
import axios from "axios";
import OCRReviewTable from "./OCRReviewTable";

export default function InvoiceOCR() {

    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState("");
    const [results, setResults] = useState([]);

    const submit = async () => {

        if (!file) return;

        const formData = new FormData();

        formData.append("image", file);

        const response = await axios.post(
            "/ocr/invoice",
            formData
        );

        console.log(response.data);

        setText(`${response.data.text}\n\nProductos detectados:\n${JSON.stringify(response.data.products, null, 2)}`);
        setResults(response.data.products);
    };

    return (
        <div className="space-y-4 border p-4 rounded">

            <h2 className="font-bold">
                OCR Factura
            </h2>

            <input
                type="file"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                    }
                }}
            />

            <button
                type="button"
                onClick={submit}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Procesar factura
            </button>

            {results.length > 0 && (
                <OCRReviewTable results={results} />
            )}

            <pre className="whitespace-pre-wrap">
                {text}
            </pre>

        </div>
    );
}
