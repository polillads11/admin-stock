import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

export default function Edit({ offer }: any) {
  const { data, setData, put, errors } = useForm<{
    name: string;
    description: string;
    discount: number;
    start_date: string;
    end_date: string;
    active: boolean;
  }>({
    name: offer.name || "",
    description: offer.description || "",
    discount: offer.discount || 0,
    start_date: offer.start_date || "",
    end_date: offer.end_date || "",
    active: offer.active || false,
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
      title: 'Editar Oferta',
      href: '/offers',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("offers.update", offer.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-2xl mx-auto">
        <Head title="Editar Oferta" />

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {flash.success}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Editar Oferta</h1>

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

          <div>
            <label className="block font-semibold">Descripción</label>
            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full border rounded p-2"
            />
            {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
          </div>

          <div>
            <label className="block font-semibold">Descuento (%)</label>
            <input
              type="number"
              value={data.discount}
              onChange={(e) => setData("discount", parseFloat(e.target.value) || 0)}
              className="w-full border rounded p-2"
            />
            {errors.discount && <div className="text-red-500 text-sm">{errors.discount}</div>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Inicio</label>
              <input
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="w-full border rounded p-2"
              />
              {errors.start_date && <div className="text-red-500 text-sm">{errors.start_date}</div>}
            </div>
            <div>
              <label className="block font-semibold">Fin</label>
              <input
                type="date"
                value={data.end_date}
                onChange={(e) => setData("end_date", e.target.value)}
                className="w-full border rounded p-2"
              />
              {errors.end_date && <div className="text-red-500 text-sm">{errors.end_date}</div>}
            </div>
          </div>

          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={data.active}
                onChange={(e) => setData("active", e.target.checked)}
                className="mr-2"
              />
              Activa
            </label>
          </div>

          <div className="flex justify-between">
            <Link href={route("offers.index")} className="text-gray-700">
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
