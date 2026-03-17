import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { BreadcrumbItem } from "@/types";

export default function Stock({ product }: { product: any }) {
  const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Editar Stock',
            href: '/products',
        },
    ];
  const [stocks, setStocks] = useState(
    product.local_stocks.reduce((acc: Record<number, number>, pls: any) => {
      acc[pls.id] = pls.stock;
      return acc;
    }, {})
  );

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.put(route('products.stock.update', product.id), {
      stocks,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Stock – ${product.name}`} />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Editar stock – {product.name}
        </h1>

        

        <form onSubmit={submit}>
          <table className="w-full border mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Local</th>
                <th className="p-2 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {product.local_stocks.map((pls: any) => (
                <tr key={pls.id} className="border-t">
                  <td className="p-2">{pls.local.name}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="border rounded p-2 w-full"
                      value={stocks[pls.id]}
                      onChange={(e) =>
                        setStocks({
                          ...stocks,
                          [pls.id]: Number(e.target.value),
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between">
            <Link href={route("products.index")} className="text-gray-700">
              ← Volver
            </Link>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar stock
            </button>            
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
