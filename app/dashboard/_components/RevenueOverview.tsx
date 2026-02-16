"use client";

import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type RevenueOverviewProps = {
    monthlyRevenue: Record<string, number>;
    revenueByStatus: Record<string, number>;
    totalIncome: number;
};

const STATUS_COLORS: Record<string, string> = {
    PENDENTE: "#f59e0b",
    CONFIRMADA: "#3b82f6",
    EM_CURSO: "#8b5cf6",
    CONCLUÍDA: "#10b981",
    CANCELADA: "#ef4444",
};

export default function RevenueOverview({ monthlyRevenue, revenueByStatus, totalIncome }: RevenueOverviewProps) {
    // Transform monthly data for line chart
    const monthlyData = Object.entries(monthlyRevenue ?? {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, revenue]) => ({
            month: month.substring(5), // Get MM from YYYY-MM
            revenue: revenue,
        }));

    // Transform status data for pie chart
    const statusData = Object.entries(revenueByStatus ?? {}).map(([status, revenue]) => ({
        name: status,
        value: revenue,
    }));

    if (!monthlyData.length && !statusData.length) {
        return (
            <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Análise de Receitas</h2>
                        <p className="text-sm text-gray-500 mt-1">Nenhum dado financeiro disponível para análise.</p>
                    </div>
                </div>
                <div className="h-40 flex items-center justify-center text-gray-400">
                    Sem dados para exibir
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Análise de Receitas</h2>
                    <p className="text-sm text-gray-500 mt-1">Visão detalhada do desempenho financeiro</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Total Acumulado</p>
                    <p className="text-3xl font-black text-primary mt-1">
                        {new Intl.NumberFormat("pt-PT", { style: "currency", currency: "CVE" }).format(totalIncome)}
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Line Chart - Monthly Revenue */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Receita Mensal</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#6b7280"
                                    style={{ fontSize: '12px', fontWeight: 600 }}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    style={{ fontSize: '12px', fontWeight: 600 }}
                                    tickFormatter={(value: any) => `${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value: any) => [
                                        new Intl.NumberFormat("pt-PT", { style: "currency", currency: "CVE" }).format(value),
                                        "Receita"
                                    ]}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', r: 5 }}
                                    activeDot={{ r: 7 }}
                                    name="Receita"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Revenue by Status */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Receita por Estado</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "#6b7280"} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value: number | undefined) => [
                                        new Intl.NumberFormat("pt-PT", { style: "currency", currency: "CVE" }).format(value ?? 0),
                                        "Receita"
                                    ]}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
