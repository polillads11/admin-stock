import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

export default function Create() {
  const { data, setData, post, errors } = useForm({
    name: "",
    slug: "",
  });

  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'Categories Create',
          href: '/categories',
      },
    ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("categories.store"));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Categoría" />
      <h1 className="text-2xl font-bold mb-4">Nueva Categoría</h1>

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
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Guardar
        </button>
        </div>
      </form>
    </AppLayout>
  );
}
