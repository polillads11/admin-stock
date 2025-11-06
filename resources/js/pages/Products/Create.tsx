import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { route } from 'ziggy-js';
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products Create',
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

interface Props {
  categories: Category[];
  locals: Local[];
}

export default function Create({ categories, locals }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    local_id: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("products.store"));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nuevo Producto</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block font-semibold">SKU</label>
          <input
            className="border rounded w-full p-2"
            value={data.sku}
            onChange={(e) => setData("sku", e.target.value)}
          />
          {errors.sku && <p className="text-red-500">{errors.sku}</p>}
        </div>

        <div>
          <label className="block font-semibold">Nombre</label>
          <input
            className="border rounded w-full p-2"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-semibold">Descripción</label>
          <textarea
            className="border rounded w-full p-2"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Categoría</label>
          <select
            className="border rounded w-full p-2"
            value={data.category_id}
            onChange={(e) => setData("category_id", e.target.value)}
          >
            <option value="">Seleccionar</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Local */}
        <div>
          <label className="block font-semibold">Local</label>
          <select
            value={data.local_id}
            onChange={(e) => setData("local_id", e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccionar local</option>
            {locals.map((local) => (
              <option key={local.id} value={local.id}>
                {local.name}
              </option>
            ))}
          </select>
          {errors.local_id && (
            <div className="text-red-600">{errors.local_id}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Precio</label>
            <input
              type="number"
              className="border rounded w-full p-2"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">Stock</label>
            <input
              type="number"
              className="border rounded w-full p-2"
              value={data.stock}
              onChange={(e) => setData("stock", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Link href={route("products.index")} className="text-gray-700">
            ← Volver
          </Link>
          <button
            disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
    </AppLayout>
  );
}
