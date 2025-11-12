import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { route } from 'ziggy-js';
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
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
  stock: number;
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
  if (confirm('Are you sure you want to delete this product?')) {
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
      <div className="p-6">
        {can('products.create') && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Productos</h1>
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
              <th className="p-2">Stock</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.data.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{p.sku}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category?.name ?? "-"}</td>
                <td className="p-2">${p.price.toFixed(2)}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">
                  <Link href={route('products.show', p.id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                    Show
                  </Link>
                  {can('products.edit') && ( 
                  <Link href={route('products.edit', p.id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300">
                    Edit
                  </Link>)}
                  {can('products.delete') && ( 
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300">
                    Delete
                  </button>)}
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
