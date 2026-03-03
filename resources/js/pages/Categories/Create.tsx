import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

export default function Create() {
  const { data, setData, post, errors } = useForm({
    name: "",
    slug: "",
  });

  const { flash } = usePage().props as any;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash?.success]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Crear Categoria',
      href: '/categories',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("categories.store"));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-2xl mx-auto">
        <Head title="Crear Categoría" />
        
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {flash.success}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Nueva Categoría</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="w-full border rounded p-2"
            />
            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>

          <div className="flex justify-between">
            <Link href={route("categories.index")} className="text-gray-700">
              ← Volver
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
