import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

export default function Create() {
  const { data, setData, post, errors } = useForm({
    name: "",
    description: "",
    discount: 0,
    start_date: "",
    end_date: "",
    active: true,
    products: [],
  });

  const { props } = usePage<any>();
  const availableProducts = props.products || [];

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
      title: 'Crear Oferta',
      href: '/offers',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("offers.store"));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-2xl mx-auto">
        <Head title="Crear Oferta" />

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {flash.success}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Nueva Oferta</h1>

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

          {/* Productos afectados */}
          <div>
            <label className="block font-semibold mb-1">Productos (dejar vacío para aplicar a todos)</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border p-2">
              {availableProducts.map((prod: any) => {
                const selected = data.products.find((p: any) => p.id === prod.id);
                return (
                  <div key={prod.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setData("products", [...data.products, { id: prod.id, quantity: 1 }]);
                        } else {
                          setData("products", data.products.filter((p: any) => p.id !== prod.id));
                        }
                      }}
                    />
                    <span>{prod.name}</span>
                    {selected && (
                      <input
                        type="number"
                        min="1"
                        value={selected.quantity}
                        onChange={(e) => {
                          const q = parseInt(e.target.value) || 1;
                          setData("products", data.products.map((p: any) =>
                            p.id === prod.id ? { ...p, quantity: q } : p
                          ));
                        }}
                        className="w-16 border rounded p-1"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {errors.products && <div className="text-red-500 text-sm">{errors.products}</div>}
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
