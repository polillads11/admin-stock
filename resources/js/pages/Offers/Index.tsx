import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';
import { can } from '@/lib/can';

interface Offer {
  id: number;
  name: string;
  discount: number;
  start_date?: string;
  end_date?: string;
  active: boolean;
  products_count?: number;
}

export default function Index({ offers }: { offers: { data: Offer[] } }) {
  const { flash } = usePage().props as any;

  const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ofertas',
        href: '/offers',
    },
  ];

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar esta oferta?")) {
      router.delete(route("offers.destroy", id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ofertas" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ofertas</h1>
        {can('offers.create') && (
        <Link
          href={route("offers.create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Nueva Oferta
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
            <th className="p-2 text-left border">Nombre</th>
            <th className="p-2 text-left border">Descuento</th>
            <th className="p-2 text-left border">Productos</th>
            <th className="p-2 text-left border">Inicio</th>
            <th className="p-2 text-left border">Fin</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {offers.data.map((offer) => (
            <tr key={offer.id}>
              <td className="p-2 border">{offer.name}</td>
              <td className="p-2 border">{offer.discount}%</td>
              <td className="p-2 border">{offer.products_count || 0}</td>
              <td className="p-2 border">{offer.start_date || '-'}</td>
              <td className="p-2 border">{offer.end_date || '-'}</td>
              <td className="p-2 border text-center">
                <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-200">
                {can('offers.edit') && (<Link
                  href={route("offers.edit", offer.id)}
                  className="px-2 py-1 text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                >
                  Editar
                </Link>)}
                {can('offers.delete') && (<button
                  onClick={() => handleDelete(offer.id)}
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
