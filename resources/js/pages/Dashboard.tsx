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
  { title: "Panel", href: "/dashboard" },
];

export default function Dashboard() {
  const { totalSales, amountSales, salesByLocal, salesByDate, topProducts, users, filters } = usePage().props as unknown as {
    totalSales: number;
    amountSales: number;
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
      <Head title="Panel de ventas" />
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

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        
          <Card>
            <CardContent className="p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4">Ventas Totales</h2>              
                <div className="flex flex-col justify-between w-full h-full">
                  <div>
                    <p className="p-1 text-green-500 underline">Ganancias:</p>
                    <h2 className="text-center text-5xl font-bold text-blue-600 w-full">
                      $ {totalSales.toLocaleString()}
                    </h2>
                  </div>
                  <div>
                    <p className="p-1 text-green-500 underline">Cantidad:</p>
                    <h2 className="text-center text-5xl font-bold text-blue-600 w-full">
                      {amountSales.toLocaleString()}
                    </h2>
                  </div>
                </div>              
            </CardContent>
          </Card>


        {/* 📊 Gráfico 1: Ventas por Local */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Ventas por Local</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesByLocal}>
                <XAxis dataKey="local" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 🥧 Gráfico 3: Top Productos */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Top Productos Vendidos</h2>
            <ResponsiveContainer width="100%" height={200}>
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
    </AppLayout>
  );
}
