import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { route } from 'ziggy-js';
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { can } from '@/lib/can'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ventas',
        href: '/sales',
    },
];

interface User {
  id: number;
  name: string;
}

interface Sale {
  id: number;
  customer_name: string | null;
  total: number;
  status: string;
  created_at: string;
  user: User;
}

interface Props {
  sales: {
    data: Sale[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  filters: { search?: string };
}

export default function Index({ sales, filters }: Props) {
  const [search, setSearch] = useState(filters.search || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route("sales.index"), { search });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="p-6">
      {/* Encabezado */}
       <Link
                href={route("dashboard")}
                className="text-gray-700 underline"
              >
                ← Volver
              </Link>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ventas</h1>
        {can('sales.create') && (<Link
          href={route("sales.create")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Nueva Venta
        </Link>)}
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente o ID..."
          className="border rounded-lg px-3 py-2 w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="ml-2 bg-gray-800 text-white px-3 py-2 rounded-lg">
          Buscar
        </button>
      </form>

      {/* Tabla de ventas */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">#</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Total</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Vendedor</th>
            <th className="p-2">Fecha</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.data.length > 0 ? (
            sales.data.map((sale) => (
              <tr key={sale.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{sale.id}</td>
                <td className="p-2">
                  {sale.customer_name || "Cliente genérico"}
                </td>
                <td className="p-2">${sale.total.toFixed(2)}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      sale.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {sale.status === "completed" ? "Completada" : "Pendiente"}
                  </span>
                </td>
                <td className="p-2">{sale.user.name}</td>
                <td className="p-2">
                  {new Date(sale.created_at).toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  <Link
                    href={route("sales.show", sale.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={7}>
                No se encontraron ventas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="mt-4 flex gap-2">
        {sales.links.map((link, i) => (
          <button
            key={i}
            disabled={!link.url}
            className={`px-3 py-1 rounded ${
              link.active
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => link.url && router.visit(link.url)}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    </div>
    </AppLayout>
  );
}
