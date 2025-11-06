import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Index({ categories }: { categories: { data: Category[] } }) {
  const { flash } = usePage().props as any;

  const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
  ];

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar esta categoría?")) {
      router.delete(route("categories.destroy", id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categorías" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Link
          href={route("categories.create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Nueva Categoría
        </Link>
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
            <th className="p-2 text-left border">Slug</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.data.map((category) => (
            <tr key={category.id}>
              <td className="p-2 border">{category.name}</td>
              <td className="p-2 border">{category.slug}</td>
              <td className="p-2 border text-center">
                <Link
                  href={route("categories.edit", category.id)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
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
