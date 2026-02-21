import React from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products Show',
        href: '/products',
    },
];

interface Category {
  id: number;
  name: string;
}

interface Local {
  id: number;
  name: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
  };
  local_stocks: Array<{
    id: number;
    stock: number;
    local: {
      id: number;
      name: string;
    };
  }>;
}

export default function Show({ product }: { product: Product }) {
  const totalStock = product.local_stocks.reduce(
    (sum, ls) => sum + ls.stock,
    0
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Producto: ${product.name}`} />

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Detalles del Producto
          </h1>

          <button
            onClick={() => router.visit(route("products.index"))}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
          >
            Volver
          </button>
        </div>

        {/* Datos generales */}
        <div className="space-y-2 mb-6">
          <div><b>SKU:</b> {product.sku}</div>
          <div><b>Nombre:</b> {product.name}</div>
          <div><b>Descripción:</b> {product.description}</div>
          <div><b>Categoría:</b> {product.category?.name ?? "—"}</div>
          <div><b>Precio:</b> ${product.price}</div>

          <div>
            <b>Stock total:</b>{" "}
            <span className={totalStock > 0 ? "text-green-600" : "text-red-600"}>
              {totalStock}
            </span>
          </div>
        </div>

        {/* STOCK POR LOCAL */}
        <h2 className="text-lg font-semibold mb-2">Stock por local</h2>

        <table className="w-full border rounded">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 text-left">Local</th>
              <th className="p-2 text-right">Stock</th>
            </tr>
          </thead>
          <tbody>
            {product.local_stocks.map((ls) => (
              <tr key={ls.id} className="border-t">
                <td className="p-2">{ls.local.name}</td>
                <td
                  className={`p-2 text-right font-semibold ${
                    ls.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {ls.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() =>
              router.visit(route("products.stock", product.id))
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Editar stock
          </button>

          <button
            onClick={() =>
              router.visit(route("products.edit", product.id))
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Editar producto
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

