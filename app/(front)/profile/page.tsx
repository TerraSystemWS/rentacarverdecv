"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import { BookingRow, Invoice, MyReview, PagedBookings } from "@/lib/api/types";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/app/ui/front/PageHeader";
import MyDataForm from "@/app/ui/front/profile/MyDataForm";
import ReviewDialog from "@/app/ui/front/reviews/ReviewDialog";
import { StarsView } from "@/app/ui/front/reviews/Stars";
import UnpaidExpiryNotice from "@/app/ui/front/payment/UnpaidExpiryNotice";
import EmailVerifyBanner from "@/app/ui/front/profile/EmailVerifyBanner";
import ExtendBookingDialog from "@/app/ui/front/profile/ExtendBookingDialog";
import { useLocale, useTranslations } from "next-intl";
import { localeTags, isLocale } from "@/i18n/config";

const HISTORY_PAGE_SIZE = 6;

export default function ProfilePage() {
    const { isAuthenticated, isLoading, logout, user } = useAuth();
    const router = useRouter();
    const t = useTranslations("profile");
    const tr = useTranslations("reviews");
    const tStatus = useTranslations("bookingStatus");
    const tc = useTranslations("common");
    const locale = useLocale();
    const money = (v: number) => fmtMoney(v, "CVE", isLocale(locale) ? localeTags[locale] : "pt-PT");

    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [tab, setTab] = useState<"bookings" | "data">("bookings");
    // "Estender aluguer" (reserva paga ou em curso): diálogo com a nova data.
    const [extendTarget, setExtendTarget] = useState<BookingRow | null>(null);

    // /profile?tab=dados abre logo "Os Meus Dados" (link do erro "complete os
    // seus dados" ao reservar e do resumo do pagamento).
    useEffect(() => {
        if (new URLSearchParams(window.location.search).get("tab") === "dados") {
            setTab("data");
        }
    }, []);

    // Histórico paginado — só pede ao servidor as 6 reservas da página atual;
    // o resto só é pedido quando o cliente clica "2, 3, ..." (ver
    // /dashboard/bookings/me/history no backend).
    const [history, setHistory] = useState<PagedBookings | null>(null);
    const [historyLoading, setHistoryLoading] = useState(true);

    const invoiceFor = (bookingId: number) => invoices.find((inv) => inv.bookingId === bookingId);

    // Avaliações: uma por reserva CONCLUÍDA. O email pós-devolução traz
    // ?avaliar=<id da reserva>&estrelas=<1-5> e abre logo o formulário.
    const [myReviews, setMyReviews] = useState<MyReview[]>([]);
    const [reviewTarget, setReviewTarget] = useState<{ bookingId: number; vehicle?: string; customerName?: string; initialRating?: number } | null>(null);
    const [reviewLinkHandled, setReviewLinkHandled] = useState(false);
    const reviewFor = (bookingId: number) => myReviews.find((r) => r.bookingId === bookingId);

    // Cancelar uma reserva ainda não paga (PENDENTE/APROVADA). Confirmação em
    // dois passos no próprio cartão; a API recusa se já estiver paga ou com um
    // pagamento Vinti4 a decorrer. Cores com "!": o CSS legado pinta todos os
    // <button> de branco a 11px.
    const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [cancelError, setCancelError] = useState<{ id: number; message: string } | null>(null);

    async function handleCancelBooking(id: number) {
        setCancellingId(id);
        setCancelError(null);
        try {
            const res = await authFetch(endpoints.bookings.cancelMine(id), { method: "POST" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || t("cancelError"));
            }
            setBookings((prev) => prev.filter((b) => b.id !== id));
            setConfirmCancelId(null);
            fetchHistory(0);
        } catch (e) {
            setCancelError({ id, message: (e as Error).message || t("cancelError") });
        } finally {
            setCancellingId(null);
        }
    }

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
                const [bookingsRes, invoicesRes, reviewsRes] = await Promise.all([
                    authFetch(endpoints.bookings.me),
                    authFetch(endpoints.invoices.mine),
                    authFetch(endpoints.reviews.mine),
                ]);
                if (reviewsRes.ok) {
                    setMyReviews(await reviewsRes.json());
                }
                if (!bookingsRes.ok) throw new Error(t("loadError"));
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

    // Link do email: abre o formulário da reserva (quando o histórico já chegou).
    useEffect(() => {
        if (reviewLinkHandled || fetchLoading || historyLoading) return;
        const params = new URLSearchParams(window.location.search);
        const id = Number(params.get("avaliar"));
        setReviewLinkHandled(true);
        if (!id) return;
        const b = [...bookings, ...(history?.content ?? [])].find((x) => x.id === id);
        const stars = Number(params.get("estrelas"));
        setTab("bookings");
        setReviewTarget({
            bookingId: id,
            vehicle: b?.vehicle_title,
            customerName: b?.customer_name,
            initialRating: stars >= 1 && stars <= 5 ? stars : undefined,
        });
        window.history.replaceState(null, "", window.location.pathname);
    }, [reviewLinkHandled, fetchLoading, historyLoading, bookings, history]);

    if (isLoading || (!isAuthenticated && !isLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    const activeBookings = bookings.filter(b => b.status === "PENDENTE" || b.status === "APROVADA" || b.status === "PAGA" || b.status === "EM_CURSO");

    function getStatusBadge(status: string) {
        const styles: Record<string, string> = {
            PENDENTE: "bg-amber-100 text-amber-800",
            APROVADA: "bg-blue-100 text-blue-800",
            PAGA: "bg-violet-100 text-violet-800",
            EM_CURSO: "bg-indigo-100 text-indigo-800",
            "CONCLUÍDA": "bg-emerald-100 text-emerald-800",
            CANCELADA: "bg-red-100 text-red-800",
        };
        const label = tStatus.has(status) ? tStatus(status) : status;
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] ?? "bg-gray-100 text-gray-800"}`}>{label}</span>;
    }

    const renderBookingsList = (list: BookingRow[], emptyMsg: string) => {
        if (list.length === 0) {
            return <div className="text-slate-600 py-6 text-center v2-card">{emptyMsg}</div>;
        }

        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map(b => (
                    <div key={b.id} className="v2-card v2-card--booking text-left flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="v2-card__name">{b.vehicle_title || t("vehicleUnknown")}</h3>
                                    <p className="text-xs font-semibold text-slate-500">
                                        {b.extends_booking_id ? t("extensionOf", { id: b.extends_booking_id }) : t("bookingNumber", { id: b.id })}
                                    </p>
                                </div>
                                {getStatusBadge(b.status)}
                            </div>

                            <div className="space-y-2 text-sm text-slate-700 mb-6">
                                <p><span className="font-semibold text-slate-800">{t("start")}</span> {fmtDateTime(b.start_at)}</p>
                                <p><span className="font-semibold text-slate-800">{t("end")}</span> {fmtDateTime(b.end_at)}</p>
                                {b.rental_end_at && b.rental_end_at !== b.end_at && (
                                    <p className="font-semibold text-green-700">{t("extendedUntil", { date: fmtDateTime(b.rental_end_at) })}</p>
                                )}
                                <p><span className="font-semibold text-slate-800">{t("createdAt")}</span> {fmtDateTime(b.created_at)}</p>
                            </div>
                            {b.expires_at && (
                                <div className="-mt-3 mb-4">
                                    <UnpaidExpiryNotice expiresAt={b.expires_at} compact />
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-slate-600 font-medium">{t("estimatedTotal")}</span>
                            <span className="v2-card__amount v2-card__amount--sm">{money(b.grand_total)}</span>
                        </div>
                        {/* gap no contentor: o CSS legado zera as margens dos botões */}
                        <div className="mt-3 flex flex-col gap-3 empty:hidden">
                            {b.can_extend && !b.extends_booking_id && (
                                <button
                                    type="button"
                                    onClick={() => setExtendTarget(b)}
                                    className="btn-racv w-full text-center text-sm"
                                >
                                    {t("extendButton")}
                                </button>
                            )}
                            {(b.status === "PENDENTE" || b.status === "APROVADA") && b.payment_status !== "SUCCESS" && (
                                <Link
                                    href={`/payment/${b.id}`}
                                    className="btn-racv w-full text-center text-sm"
                                >
                                    {t("payNow")}
                                </Link>
                            )}
                            {(b.status === "PENDENTE" || b.status === "APROVADA") && b.payment_status !== "SUCCESS" && (
                                confirmCancelId === b.id ? (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm" role="group" aria-label={t("cancelConfirm")}>
                                        <p className="mb-2 font-semibold text-red-800">{t("cancelConfirm")}</p>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleCancelBooking(b.id)}
                                                disabled={cancellingId === b.id}
                                                className="flex-1 whitespace-nowrap rounded-lg !bg-red-600 !px-2 py-2 !font-bold !text-white !text-sm hover:!bg-red-700 disabled:opacity-60"
                                            >
                                                {cancellingId === b.id ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : t("cancelYes")}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmCancelId(null)}
                                                disabled={cancellingId === b.id}
                                                className="flex-1 whitespace-nowrap rounded-lg border border-slate-300 !bg-white !px-2 py-2 !font-bold !text-slate-700 !text-sm hover:!bg-slate-50"
                                            >
                                                {t("cancelNo")}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => { setConfirmCancelId(b.id); setCancelError(null); }}
                                        className="w-full rounded-lg border border-red-300 !bg-white py-2 text-center !text-sm !font-bold !text-red-700 hover:!bg-red-50 transition-colors"
                                    >
                                        {t("cancelBooking")}
                                    </button>
                                )
                            )}
                            {cancelError?.id === b.id && (
                                <p role="alert" className="text-sm text-red-700">{cancelError.message}</p>
                            )}
                            {invoiceFor(b.id) && (
                                <button
                                    onClick={() => handleDownloadInvoice(invoiceFor(b.id)!.id)}
                                    className="invoice-download-btn w-full text-center text-sm font-bold border border-green-400 bg-green-50 rounded-lg py-2 hover:bg-green-100 transition-colors"
                                >
                                    {t("downloadInvoice")}
                                </button>
                            )}
                            {/* Avalia-se o aluguer na reserva original, não nas extensões. */}
                            {b.status === "CONCLUÍDA" && !b.extends_booking_id && (() => {
                                const rv = reviewFor(b.id);
                                if (rv?.status === "APPROVED") {
                                    return (
                                        <p className="rv-profile-state rv-profile-state--ok">
                                            <StarsView value={rv.rating} size={15} /> {tr("published")}
                                        </p>
                                    );
                                }
                                return (
                                    <>
                                        {rv && (
                                            <p className={`rv-profile-state ${rv.status === "REJECTED" ? "rv-profile-state--warn" : ""}`}>
                                                {rv.status === "REJECTED" ? tr("rejected") : tr("pending")}
                                            </p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setReviewTarget({ bookingId: b.id, vehicle: b.vehicle_title, customerName: b.customer_name })}
                                            className="btn-racv w-full text-center text-sm"
                                        >
                                            {rv ? tr("edit") : tr("write")}
                                        </button>
                                    </>
                                );
                            })()}
                            {b.payment_status === "SUCCESS" && (
                                <Link
                                    href={`/payment/result?status=success&id=${b.id}`}
                                    className="invoice-download-btn block w-full text-center text-sm font-bold border border-slate-300 bg-white rounded-lg py-2 hover:bg-slate-50 transition-colors"
                                >
                                    {t("viewReceipt")}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-slate-100 min-h-screen pb-20">
            <PageHeader titulo={t("hello", { name: (user as any)?.username || t("customer") })} descricao={t("welcome")} />

            <div className="container mx-auto px-4 mt-10 max-w-6xl">

                <div className="v2-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h2 className="v2-card__name">{t("myAccount")}</h2>
                        <p className="text-slate-600 text-sm">{t("accountDesc")}</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full sm:w-auto btn-racv"
                    >
                        {t("signOut")}
                    </button>
                </div>

                <EmailVerifyBanner />

                <div className="profile-tabs flex gap-2 mb-8">
                    <button
                        onClick={() => setTab("bookings")}
                        className={`v2-tab ${tab === "bookings" ? "is-active" : ""}`}
                    >
                        {t("tabBookings")}
                    </button>
                    <button
                        onClick={() => setTab("data")}
                        className={`v2-tab ${tab === "data" ? "is-active" : ""}`}
                    >
                        {t("tabData")}
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
                            <h2 className="v2-subtitle mb-6 flex items-center gap-2">
                                {t("active")}
                                <span className="bg-green-100 text-green-900 text-xs py-1 px-2 rounded-full">{activeBookings.length}</span>
                            </h2>
                            {renderBookingsList(activeBookings, t("noActive"))}
                        </section>

                        <section>
                            <h2 className="v2-subtitle mb-6 flex items-center gap-2">
                                {t("history")}
                                <span className="bg-slate-200 text-slate-800 text-xs py-1 px-2 rounded-full">{history?.total_elements ?? 0}</span>
                            </h2>

                            {historyLoading ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                                </div>
                            ) : (
                                <>
                                    {renderBookingsList(history?.content ?? [], t("noHistory"))}

                                    {history && history.total_pages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-8">
                                            <button
                                                onClick={() => fetchHistory(history.page - 1)}
                                                disabled={history.page === 0}
                                                aria-label={tc("previousPage")}
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
                                                aria-label={tc("nextPage")}
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

            {reviewTarget && (
                <ReviewDialog
                    bookingId={reviewTarget.bookingId}
                    vehicle={reviewTarget.vehicle}
                    customerName={reviewTarget.customerName}
                    initialRating={reviewTarget.initialRating}
                    existing={reviewFor(reviewTarget.bookingId) ?? null}
                    onClose={() => setReviewTarget(null)}
                    onSaved={(saved) => setMyReviews((prev) => [saved, ...prev.filter((r) => r.bookingId !== saved.bookingId)])}
                />
            )}

            {extendTarget && <ExtendBookingDialog booking={extendTarget} onClose={() => setExtendTarget(null)} />}
        </div>
    );
}
