import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

export default function Show({ offer }: any) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Oferta',
      href: `/offers/${offer.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Oferta ${offer.name}`} />

      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">{offer.name}</h1>
        <p>{offer.description}</p>
        <p>Descuento: {offer.discount}%</p>
        <p>Inicio: {offer.start_date || '-'} </p>
        <p>Fin: {offer.end_date || '-'}</p>
        <p>Activa: {offer.active ? 'Sí' : 'No'}</p>
        {offer.products && offer.products.length > 0 && (
          <div>
            <h2 className="font-semibold mt-4">Productos incluidos:</h2>
            <ul className="list-disc list-inside">
              {offer.products.map((p: any) => (
                <li key={p.id}>
                  {p.name} {p.pivot?.quantity && `(x${p.pivot.quantity})`}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href={route("offers.index")} className="text-blue-600">
          ← Volver
        </Link>
      </div>
    </AppLayout>
  );
}
