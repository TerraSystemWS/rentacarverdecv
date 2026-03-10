"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import { BookingRow } from "@/lib/api/types";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import { Loader2 } from "lucide-react";
import PageHeader from "@/app/ui/front/PageHeader";

export default function ProfilePage() {
    const { isAuthenticated, isLoading, logout, user } = useAuth();
    const router = useRouter();

    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchMyBookings = async () => {
            setFetchLoading(true);
            setErr(null);
            try {
                const res = await authFetch(endpoints.bookings.me);
                if (!res.ok) throw new Error("Erro ao pesquisar reservas");
                const data = await res.json();
                setBookings(data);
            } catch (e: any) {
                setErr(e.message);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchMyBookings();
    }, [isAuthenticated]);

    if (isLoading || (!isAuthenticated && !isLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
            </div>
        );
    }

    const activeBookings = bookings.filter(b => b.status === "PENDENTE" || b.status === "CONFIRMADA" || b.status === "EM_CURSO");
    const pastBookings = bookings.filter(b => b.status === "CONCLUÍDA" || b.status === "CANCELADA");

    function getStatusBadge(status: string) {
        switch (status) {
            case "PENDENTE": return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold uppercase tracking-wider">Pendente</span>;
            case "CONFIRMADA": return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase tracking-wider">Confirmada</span>;
            case "EM_CURSO": return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-bold uppercase tracking-wider">Em Curso</span>;
            case "CONCLUÍDA": return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold uppercase tracking-wider">Concluída</span>;
            case "CANCELADA": return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold uppercase tracking-wider">Cancelada</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-bold uppercase tracking-wider">{status}</span>;
        }
    }

    const renderBookingsList = (list: BookingRow[], emptyMsg: string) => {
        if (list.length === 0) {
            return <div className="text-slate-500 py-6 text-center bg-white border border-slate-200 rounded-lg">{emptyMsg}</div>;
        }

        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map(b => (
                    <div key={b.id} className="bg-white border text-left border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-800 text-lg">{b.vehicle_title || "Veículo não especificado"}</h3>
                                {getStatusBadge(b.status)}
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 mb-6">
                                <p><span className="font-semibold text-slate-700">Início:</span> {fmtDateTime(b.start_at)}</p>
                                <p><span className="font-semibold text-slate-700">Fim:</span> {fmtDateTime(b.end_at)}</p>
                                <p><span className="font-semibold text-slate-700">Criado a:</span> {fmtDateTime(b.created_at)}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Total Estimado</span>
                            <span className="text-lg font-black text-slate-900">{fmtMoney(b.grand_total, "CVE")}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <PageHeader titulo={`Olá, ${(user as any)?.username || 'Cliente'}!`} descricao="Bem-vindo à sua Área de Cliente" />

            <div className="container mx-auto px-4 mt-10 max-w-6xl">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">A Minha Conta</h2>
                        <p className="text-slate-500 text-sm">Faça a gestão dos seus alugueres e histórico no nosso sistema.</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 font-semibold rounded-lg transition-colors border border-red-200 text-center"
                    >
                        Terminar Sessão
                    </button>
                </div>

                {fetchLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                    </div>
                ) : err ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center font-medium">
                        {err}
                    </div>
                ) : (
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                Reservas Ativas
                                <span className="bg-yellow-100 text-yellow-800 text-xs py-1 px-2 rounded-full">{activeBookings.length}</span>
                            </h2>
                            {renderBookingsList(activeBookings, "Não tem nenhuma reserva a decorrer ou pendente.")}
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                Histórico de Reservas
                                <span className="bg-slate-200 text-slate-700 text-xs py-1 px-2 rounded-full">{pastBookings.length}</span>
                            </h2>
                            {renderBookingsList(pastBookings, "Ainda não tem histórico de alugueres concluídos ou cancelados.")}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
