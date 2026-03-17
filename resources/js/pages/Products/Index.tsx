import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import { route } from 'ziggy-js';
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Productos',
        href: '/products',
    },
];

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  total_stock: number;
  category?: Category;
}

interface Props {
  products: {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  filters: { search?: string };
}

function handleDelete(id: number) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    router.delete(route('products.destroy', id));
  }
}

export default function Index({ products, filters }: Props) {
  const [search, setSearch] = useState(filters.search || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route("products.index"), { search });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Productos" />
      <div className="p-3">
        {can('products.create') && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lista de Productos</h1>
          <Link
            href={route("products.create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Nuevo
          </Link>
        </div>)}

        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded-lg px-3 py-2 w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="ml-2 bg-gray-800 text-white px-3 py-2 rounded-lg">
            Buscar
          </button>
        </form>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">SKU</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Categoría</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Stock Total</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.data.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{p.sku}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category?.name ?? "-"}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.total_stock}</td>
                <td className="p-2">
                  <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-200">

                    <Link
                      href={route('products.show', p.id)}
                      className="px-2 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 border-r border-green-500">
                      Mostrar
                    </Link>

                    {can('products.edit') && (
                      <Link
                        href={route('products.edit', p.id)}
                        className="px-2 py-1 text-xs font-medium text-white bg-yellow-500 hover:bg-yellow-600 border-r border-yellow-400">
                        Editar
                      </Link>
                    )}

                    {can('products.edit') && (
                      <Link
                        href={route('products.stock', p.id)}
                        className="px-2 py-1 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 border-r border-orange-400">
                        Stock
                      </Link>
                    )}

                    {can('products.delete') && (
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700">
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex gap-2">
          {products.links.map((link, i) => (
            <button
              key={i}
              disabled={!link.url}
              className={`px-3 py-1 rounded ${link.active
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
