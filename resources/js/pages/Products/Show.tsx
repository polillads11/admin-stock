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
  category: Category;
  local: Local;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export default function Show({ product }: { product: Product }) {
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Producto: ${product.name}`} />

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Detalles del Producto
          </h1>
          <button
            onClick={() => router.visit(route("products.index"))}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            Volver
          </button>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 pt-4 space-y-3">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              SKU:
            </span>{" "}
            <span className="text-gray-900 dark:text-white">{product.sku}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Nombre:
            </span>{" "}
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Descripción:
            </span>
            <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-line">
              {product.description || "Sin descripción"}
            </p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Categoría:
            </span>{" "}
            <span className="text-gray-900 dark:text-white">
              {product.category?.name || "Sin categoría"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Local:
            </span>{" "}
            <span className="text-gray-900 dark:text-white">
              {product.local?.name || "Sin local"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Precio:
            </span>{" "}
            <span className="text-gray-900 dark:text-white">
              ${product.price}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Stock disponible:
            </span>{" "}
            <span
              className={`font-semibold ${
                product.stock > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {product.stock}
            </span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            <p>
              Creado: {new Date(product.created_at).toLocaleString("es-AR")}
            </p>
            <p>
              Actualizado: {new Date(product.updated_at).toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => router.visit(route("products.edit", product.id))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Editar
          </button>

          <button
            onClick={() => {
              if (confirm("¿Seguro que deseas eliminar este producto?")) {
                router.delete(route("products.destroy", product.id));
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Eliminar
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
