"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import { BookingRow, Invoice, PagedBookings } from "@/lib/api/types";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/app/ui/front/PageHeader";
import MyDataForm from "@/app/ui/front/profile/MyDataForm";

const HISTORY_PAGE_SIZE = 6;

export default function ProfilePage() {
    const { isAuthenticated, isLoading, logout, user } = useAuth();
    const router = useRouter();

    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [tab, setTab] = useState<"bookings" | "data">("bookings");

    // Histórico paginado — só pede ao servidor as 6 reservas da página atual;
    // o resto só é pedido quando o cliente clica "2, 3, ..." (ver
    // /dashboard/bookings/me/history no backend).
    const [history, setHistory] = useState<PagedBookings | null>(null);
    const [historyLoading, setHistoryLoading] = useState(true);

    const invoiceFor = (bookingId: number) => invoices.find((inv) => inv.bookingId === bookingId);

    async function handleDownloadInvoice(invoiceId: number) {
        try {
            const res = await authFetch(endpoints.invoices.pdf(invoiceId));
            if (!res.ok) throw new Error();
            const blob = await res.blob();
            window.open(URL.createObjectURL(blob), "_blank");
        } catch {
            // falha silenciosa aqui é aceitável — o utilizador pode tentar de novo
        }
    }

    const fetchHistory = useCallback(async (page: number) => {
        setHistoryLoading(true);
        try {
            const res = await authFetch(endpoints.bookings.meHistory(page, HISTORY_PAGE_SIZE));
            if (res.ok) {
                setHistory(await res.json());
            }
        } catch {
            // falha silenciosa — a secção de histórico só fica sem dados, o resto da página continua a funcionar
        } finally {
            setHistoryLoading(false);
        }
    }, []);

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
                const [bookingsRes, invoicesRes] = await Promise.all([
                    authFetch(endpoints.bookings.me),
                    authFetch(endpoints.invoices.mine),
                ]);
                if (!bookingsRes.ok) throw new Error("Erro ao pesquisar reservas");
                setBookings(await bookingsRes.json());
                if (invoicesRes.ok) {
                    setInvoices(await invoicesRes.json());
                }
            } catch (e: any) {
                setErr(e.message);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchMyBookings();
        fetchHistory(0);
    }, [isAuthenticated, fetchHistory]);

    if (isLoading || (!isAuthenticated && !isLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    const activeBookings = bookings.filter(b => b.status === "PENDENTE" || b.status === "APROVADA" || b.status === "PAGA" || b.status === "EM_CURSO");

    function getStatusBadge(status: string) {
        switch (status) {
            case "PENDENTE": return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold uppercase tracking-wider">Pendente</span>;
            case "APROVADA": return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase tracking-wider">Aprovada</span>;
            case "PAGA": return <span className="px-2 py-1 bg-violet-100 text-violet-800 rounded text-xs font-bold uppercase tracking-wider">Paga</span>;
            case "EM_CURSO": return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-bold uppercase tracking-wider">Em Curso</span>;
            case "CONCLUÍDA": return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold uppercase tracking-wider">Concluída</span>;
            case "CANCELADA": return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold uppercase tracking-wider">Cancelada</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-bold uppercase tracking-wider">{status}</span>;
        }
    }

    const renderBookingsList = (list: BookingRow[], emptyMsg: string) => {
        if (list.length === 0) {
            return <div className="text-slate-600 py-6 text-center bg-white border border-slate-200 rounded-lg">{emptyMsg}</div>;
        }

        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map(b => (
                    <div key={b.id} className="bg-white border text-left border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-900 text-lg">{b.vehicle_title || "Veículo não especificado"}</h3>
                                {getStatusBadge(b.status)}
                            </div>

                            <div className="space-y-2 text-sm text-slate-700 mb-6">
                                <p><span className="font-semibold text-slate-800">Início:</span> {fmtDateTime(b.start_at)}</p>
                                <p><span className="font-semibold text-slate-800">Fim:</span> {fmtDateTime(b.end_at)}</p>
                                <p><span className="font-semibold text-slate-800">Criado a:</span> {fmtDateTime(b.created_at)}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Total Estimado</span>
                            <span className="text-lg font-black text-slate-900">{fmtMoney(b.grand_total, "CVE")}</span>
                        </div>
                        {(b.status === "PENDENTE" || b.status === "APROVADA") && b.payment_status !== "SUCCESS" && (
                            <Link
                                href={`/payment/${b.id}`}
                                className="btn-racv mt-3 w-full text-center text-sm"
                            >
                                Pagar agora
                            </Link>
                        )}
                        {invoiceFor(b.id) && (
                            <button
                                onClick={() => handleDownloadInvoice(invoiceFor(b.id)!.id)}
                                className="invoice-download-btn mt-3 w-full text-center text-sm font-bold border border-green-400 bg-green-50 rounded-lg py-2 hover:bg-green-100 transition-colors"
                            >
                                Descarregar Fatura
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-slate-100 min-h-screen pb-20">
            <PageHeader titulo={`Olá, ${(user as any)?.username || 'Cliente'}!`} descricao="Bem-vindo à sua Área de Cliente" />

            <div className="container mx-auto px-4 mt-10 max-w-6xl">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">A Minha Conta</h2>
                        <p className="text-slate-600 text-sm">Faça a gestão dos seus alugueres e histórico no nosso sistema.</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full sm:w-auto btn-racv"
                    >
                        Terminar Sessão
                    </button>
                </div>

                <div className="profile-tabs flex gap-2 mb-8">
                    <button
                        onClick={() => setTab("bookings")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${tab === "bookings" ? "bg-green-600 border-green-600" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                    >
                        As Minhas Reservas
                    </button>
                    <button
                        onClick={() => setTab("data")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${tab === "data" ? "bg-green-600 border-green-600" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                    >
                        Os Meus Dados
                    </button>
                </div>

                {tab === "data" ? (
                    <MyDataForm />
                ) : fetchLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                    </div>
                ) : err ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center font-medium">
                        {err}
                    </div>
                ) : (
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                Reservas Ativas
                                <span className="bg-green-100 text-green-900 text-xs py-1 px-2 rounded-full">{activeBookings.length}</span>
                            </h2>
                            {renderBookingsList(activeBookings, "Não tem nenhuma reserva a decorrer ou pendente.")}
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                Histórico de Reservas
                                <span className="bg-slate-200 text-slate-800 text-xs py-1 px-2 rounded-full">{history?.total_elements ?? 0}</span>
                            </h2>

                            {historyLoading ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                                </div>
                            ) : (
                                <>
                                    {renderBookingsList(history?.content ?? [], "Ainda não tem histórico de alugueres concluídos ou cancelados.")}

                                    {history && history.total_pages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-8">
                                            <button
                                                onClick={() => fetchHistory(history.page - 1)}
                                                disabled={history.page === 0}
                                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            {Array.from({ length: history.total_pages }, (_, i) => i).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => fetchHistory(p)}
                                                    className={`w-9 h-9 rounded-lg text-sm font-bold border transition-colors ${p === history.page
                                                        ? "bg-green-600 border-green-600 text-white"
                                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {p + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => fetchHistory(history.page + 1)}
                                                disabled={history.page >= history.total_pages - 1}
                                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
