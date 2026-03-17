import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

interface Local {
  id: number;
  name: string;
  address?: string;
  phone?: string;
}

export default function Edit({ local }: { local: Local }) {
  const { data, setData, put, processing, errors } = useForm({
    name: local.name || "",
    address: local.address || "",
    phone: local.phone || "",
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Editar Local',
      href: '/locals',
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("locals.update", local.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Editar Local</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-semibold bg-gray-200">Nombre</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            className="w-full border rounded p-2"
          />
          {errors.name && <div className="text-red-600">{errors.name}</div>}
        </div>

        <div>
          <label className="block font-semibold bg-gray-200">Dirección</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => setData("address", e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold bg-gray-200">Teléfono</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex justify-between">
          <Link href={route("categories.index")} className="text-gray-700">
            ← Volver
          </Link>
        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
        </div>
      </form>
      </div>
    </AppLayout>
  );
}
