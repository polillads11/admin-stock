/*import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Key } from 'react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { salesByLocal, salesByDate, topProducts } = usePage().props as unknown as {
    salesByLocal: Array<{ local: string; total: number }>;
    salesByDate: Array<{ date: string; total: number }>;
    topProducts: Array<{ name: string; quantity: number }>;
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A65E9E"];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/*<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>

            <Head title="Estadísticas de Ventas" />
            
                  <div className="grid md:grid-cols-2 gap-6">
                    Total por local
                    <Card>
                      <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-2">Ventas por Local</h2>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={salesByLocal}>
                            <XAxis dataKey="local" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
            
                    Ventas por día
                    <Card>
                      <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-2">Ventas Diarias (últimos 30 días)</h2>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={salesByDate}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
            
                    Productos más vendidos
                    <Card className="md:col-span-2">
                      <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-2">Top 5 Productos Más Vendidos</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={topProducts}
                              dataKey="total_sold"
                              nameKey="name"
                              label
                              outerRadius={120}
                            >
                              {topProducts.map((_: any, index: number) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
            <div className="flex flex-col gap-6 p-6">
                1️⃣ Totales por Local
                <Card>
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Ventas por Local</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesByLocal}>
                                <XAxis dataKey="local" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                2️⃣ Evolución de Ventas
                <Card>
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Ventas por Fecha</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesByDate}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                3️⃣ Top Productos
                <Card>
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Top Productos Vendidos</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={topProducts}
                                    dataKey="quantity"
                                    nameKey="name"
                                    outerRadius={100}
                                    label
                                >
                                    {topProducts.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
*/

import AppLayout from "@/layouts/app-layout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
];

export default function Dashboard() {
  const { salesByLocal, salesByDate, topProducts, users, filters } = usePage().props as unknown as {
    salesByLocal: Array<{ local: string; total: number }>;
    salesByDate: Array<{ date: string; total: number }>;
    // include both keys that might be returned for product counts
    topProducts: Array<{ name: string; quantity?: number; total_sold?: number }>;
    users: Array<{ id: number; name: string }>;
    filters?: { user_id?: string; start_date?: string; end_date?: string };
  };

  const { data, setData, get } = useForm({
    user_id: filters?.user_id || "",
    start_date: filters?.start_date || "",
    end_date: filters?.end_date || "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    get(route("sales.statistics"), { preserveState: true });
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A65E9E"];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-6 p-6">

        {/* 🔍 Filtros */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={submit} className="flex flex-col md:flex-row items-center gap-4">
              
              <Select
                value={data.user_id}
                onValueChange={(value: string) => setData("user_id", value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos</SelectItem>
                  {users.map((u: any) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={data.start_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("start_date", e.target.value)}
              />
              <Input
                type="date"
                value={data.end_date}
                onChange={(e: any) => setData("end_date", e.target.value)}
              />

              <Button type="submit">Filtrar</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {/* 📊 Gráfico 1: Ventas por Local */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Ventas por Local</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByLocal}>
                <XAxis dataKey="local" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 📈 Gráfico 2: Ventas por Fecha */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Ventas por Fecha</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByDate}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </div>
        {/* 🥧 Gráfico 3: Top Productos */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Top Productos Vendidos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  dataKey="total_sold"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {topProducts.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
