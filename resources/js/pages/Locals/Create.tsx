import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';


export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    address: "",
    phone: "",
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Crear Local',
      href: '/locals',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("locals.store"));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-2x1 mx-auto">
        <Head title="Nuevo Local" />

        <h1 className="text-2xl font-bold mb-4">Nuevo Local</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-between">
            <Link href={route("locals.index")} className="text-gray-700">
              ← Volver
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}