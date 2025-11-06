import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products Edit',
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
  description: string;
  category_id: number;
  price: number;
  stock: number;
  local_id: number;
}

export default function Edit({
  product,
  categories,
  locals,
}: {
  product: Product;
  categories: Category[];
  locals: Local[];
}) {
  const [form, setForm] = useState({
    sku: product.sku,
    name: product.name,
    description: product.description || "",
    category_id: product.category_id,
    price: product.price,
    stock: product.stock,
    local_id: product.local_id,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await router.put(route("products.update", product.id), form);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Producto - ${product.name}`} />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Editar Producto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SKU */}
          <div>
            <label className="block font-semibold">SKU</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="border rounded w-full p-2 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block font-semibold mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded w-full p-2 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded w-full p-2 dark:bg-gray-800 dark:text-white"
              rows={3}
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block font-semibold mb-1">Categoría</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border rounded w-full p-2 dark:bg-gray-800 dark:text-white"
              //required
            >
              <option value="">Seleccionar categoría...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
          {/* Precio */}
          <div>
            <label className="block font-semibold mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border rounded w-full p-2 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block font-semibold mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="border rounded w-full p-2 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          {/* Local */}
        <div>
          <label className="block font-semibold">Local</label>
          <select
            value={form.local_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccionar local</option>
            {locals.map((local) => (
              <option key={local.id} value={local.id}>
                {local.name}
              </option>
            ))}
          </select>
        </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => router.visit(route("products.index"))}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
