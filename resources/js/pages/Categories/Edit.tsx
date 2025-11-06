import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Edit({ category }: { category: Category }) {
  const { data, setData, put, errors } = useForm({
    name: category.name || "",
    slug: category.slug || "",
  });

  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'Categories Edit',
          href: '/categories',
      },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("categories.update", category.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Categoría" />
      <h1 className="text-2xl font-bold mb-4">Editar Categoría</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-semibold">Nombre</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            className="w-full border rounded p-2"
          />
          {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
        </div>
        <div className="flex justify-between">
          <Link href={route("categories.index")} className="text-gray-700">
            ← Volver
          </Link>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Actualizar
        </button>
        </div>
      </form>
    </AppLayout>
  );
}
