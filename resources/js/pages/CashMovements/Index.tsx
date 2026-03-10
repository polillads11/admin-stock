import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';
import { can } from '@/lib/can';

interface Movement {
  id: number;
  type: string;
  amount: number;
  source?: string;
  description?: string;
  created_at: string;
  user: { id: number; name: string };
}

export default function Index({ movements }: { movements: { data: Movement[] } }) {
  const { flash } = usePage().props as any;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Caja',
      href: '/cash-movements',
    },
  ];


  const handleDelete = (id: number): void => {
    if (confirm('¿Está seguro de que desea eliminar este movimiento?')) {
      router.delete(route('cash-movements.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Movimientos de caja" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Movimientos de caja</h1>
        {can('cash.create') && (
        <Link
          href={route("cash-movements.create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Nuevo movimiento
        </Link>)}
      </div>

      {flash?.success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {flash.success}
        </div>
      )}

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Monto</th>
            <th className="p-2 border">Origen</th>
            <th className="p-2 border">Usuario</th>
            <th className="p-2 border">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {movements.data.map((m) => (
            <tr key={m.id}>
              <td className="p-2 border">{m.created_at}</td>
              <td className="p-2 border capitalize">{m.type}</td>
              <td className="p-2 border">{m.amount}</td>
              <td className="p-2 border">{m.source}</td>
              <td className="p-2 border">{m.user.name}</td>
              <td className="p-2 border">{m.description}</td>
              <td className="p-2 border text-center">
                <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-200">
                  {can('cash.edit') && (<Link
                    href={route("cash-movements.edit", m.id)}
                    className="px-2 py-1 text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                  >
                    Editar
                  </Link>)}
                  {can('cash.delete') && (<button
                    onClick={() => handleDelete(m.id)}
                    className="px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Eliminar
                  </button>)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppLayout>
  );
}
