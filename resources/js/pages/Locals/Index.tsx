import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

interface Local {
  id: number;
  name: string;
  address?: string;
  phone?: string;
}

export default function Index({ locals }: { locals: Local[] }) {
  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este local?")) {
      router.delete(route("locals.destroy", id));
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Locales',
      href: '/locals',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Locales" />

      <div className="flex justify-between items-center mb-4 p-2">
        <h1 className="text-2xl font-bold">Locales</h1>
        <Link
          href={route("locals.create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Local
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Nombre</th>
            <th className="border p-2 text-left">Dirección</th>
            <th className="border p-2 text-left">Teléfono</th>
            <th className="border p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {locals.map((local) => (
            <tr key={local.id}>
              <td className="border p-2">{local.name}</td>
              <td className="border p-2">{local.address || "-"}</td>
              <td className="border p-2">{local.phone || "-"}</td>
              <td className="border p-2 text-center">
                <Link
                  href={route("locals.edit", local.id)}
                  className="text-blue-600 hover:underline mx-2"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(local.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppLayout>
  );
}