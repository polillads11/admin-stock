import React from "react";
import { Head, useForm } from "@inertiajs/react";
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
      title: 'Locals Edit',
      href: '/locals',
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("locals.update", local.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Local" />

      <h1 className="text-2xl font-bold mb-4">Editar Local</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-semibold">Nombre</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            className="w-full border rounded p-2"
          />
          {errors.name && <div className="text-red-600">{errors.name}</div>}
        </div>

        <div>
          <label className="block font-semibold">Dirección</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => setData("address", e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Teléfono</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </form>
    </AppLayout>
  );
}
