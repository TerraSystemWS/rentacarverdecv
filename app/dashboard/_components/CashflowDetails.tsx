"use client";

import React from "react";
import {
    TrendingUp,
    CreditCard,
    Clock,
    Calendar,
    ChevronRight,
    DollarSign,
    ArrowUpRight,
    Coins
} from "lucide-react";

type CashflowProps = {
    dailyIncome: number;
    weeklyIncome: number;
    monthlyIncome: number;
    pendingIncome: number;
};

export default function CashflowDetails({
    dailyIncome,
    weeklyIncome,
    monthlyIncome,
    pendingIncome
}: CashflowProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "CVE",
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Daily Card */}
            <div className="card-solid relative overflow-hidden p-5 md:p-6 group transition-all duration-300 hover:shadow-lg border-zinc-200 dark:border-zinc-800">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-12 h-16 md:w-16 text-primary" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 md:mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Últimas 24 Horas
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {formatCurrency(dailyIncome)}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-zinc-500">Fluxo Diário</p>
                        <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            VIVO
                        </span>
                    </div>
                </div>
            </div>

            {/* Weekly Card */}
            <div className="card-solid relative overflow-hidden p-5 md:p-6 group transition-all duration-300 hover:shadow-lg border-zinc-200 dark:border-zinc-800">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Calendar className="w-12 h-16 md:w-16 text-primary" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 md:mb-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Últimos 7 Dias
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {formatCurrency(weeklyIncome)}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-zinc-500">Fluxo Semanal</p>
                        <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />
                    </div>
                </div>
            </div>

            {/* Monthly Card */}
            <div className="card-solid relative overflow-hidden p-5 md:p-6 group transition-all duration-300 hover:shadow-lg border-zinc-200 dark:border-zinc-800">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Coins className="w-12 h-16 md:w-16 text-primary" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 md:mb-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        Últimos 30 Dias
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {formatCurrency(monthlyIncome)}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-zinc-500">Fluxo Mensal</p>
                        <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />
                    </div>
                </div>
            </div>

            {/* Pending Card */}
            <div className="card-solid relative overflow-hidden p-5 md:p-6 group transition-all duration-300 hover:shadow-lg border-zinc-200 dark:border-zinc-800 bg-amber-50/30 dark:bg-amber-900/5">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-12 h-16 md:w-16 text-amber-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-3 md:mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                        Pendentes
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {formatCurrency(pendingIncome)}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-zinc-500">Saldo Espera</p>
                        <CreditCard className="w-4 h-4 text-amber-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
