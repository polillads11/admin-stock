import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { route } from 'ziggy-js';
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mostrar Venta',
        href: '/sales/show',
    },
];

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Local {
  id: number;
  name: string;
}

interface Item {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: Product;
}

interface Sale {
  id: number;
  customer_name: string | null;
  total: number;
  status: string;
  created_at: string;
  items: Item[];
  user: { name: string };
  local: Local;
}

export default function Show() {
  const { sale } = usePage().props as unknown as { sale: Sale };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Venta #{sale.id} - {sale.customer_name || "Cliente genérico"}
        </h1>
        <Link
          href={route("sales.index")}
          className="text-gray-700 underline"
        >
          ← Volver
        </Link>
      </div>

      <p>
        <strong>Vendedor:</strong> {sale.user.name}
      </p>
      <p>
        <strong>Local:</strong> {sale.local.name}
      </p>
      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(sale.created_at).toLocaleString()}
      </p>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Producto</th>
            <th className="p-2 text-left">Cantidad</th>
            <th className="p-2 text-left">Precio</th>
            <th className="p-2 text-left">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((i) => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.product.name}</td>
              <td className="p-2">{i.quantity}</td>
              <td className="p-2">${i.price}</td>
              <td className="p-2">${i.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-xl font-bold mt-4">
        Total: ${sale.total}
      </div>
    </div>
    </AppLayout>
  );
}
