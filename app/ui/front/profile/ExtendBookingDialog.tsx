"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { authFetch } from "@/app/auth/api";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import type { BookingRow, ExtensionQuote } from "@/lib/api/types";
import { dateFnsLocale, PICKER_DATE_FORMAT } from "@/lib/i18n/dateLocale";
import { cvToIso, isoToCv, localDateString, parseLocalDate } from "@/lib/utils/cvTime";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import { isLocale, localeTags } from "@/i18n/config";

/**
 * Estender um aluguer (reserva paga ou em curso): o cliente escolhe a nova data
 * de devolução; a API diz se o carro está livre e quanto custa (extension-quote)
 * e cria a extensão por pagar (extend). Depois segue para o pagamento normal.
 * A hora da devolução mantém-se; os dias ocupados por outras reservas ficam
 * bloqueados no calendário.
 */
export default function ExtendBookingDialog({ booking, onClose }: { booking: BookingRow; onClose: () => void }) {
	const t = useTranslations("profile");
	const locale = useLocale();
	const router = useRouter();
	const money = (v: number) => fmtMoney(v, "CVE", isLocale(locale) ? localeTags[locale] : "pt-PT");
	const currentEnd = booking.rental_end_at || booking.end_at;
	const endCv = isoToCv(currentEnd);
	// Primeiro dia possível: o dia a seguir à devolução atual (em Cabo Verde).
	const minDay = parseLocalDate(endCv.date)!;
	minDay.setDate(minDay.getDate() + 1);

	const [day, setDay] = useState<Date | null>(null);
	const [booked, setBooked] = useState<{ start: Date; end: Date }[]>([]);
	const [quote, setQuote] = useState<ExtensionQuote | null>(null);
	const [checking, setChecking] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		dialogRef.current?.focus();
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	// Dias já reservados deste carro (por outros), a partir da devolução atual.
	useEffect(() => {
		fetch(`${API_BASE_URL}${endpoints.vehicles.bookedDates(booking.vehicle_id)}`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data: { startDate: string; endDate: string }[]) =>
				setBooked(
					(data || [])
						.map((d) => ({ start: new Date(d.startDate), end: new Date(d.endDate) }))
						.filter((b) => b.start >= new Date(currentEnd)),
				),
			)
			.catch(() => {
				/* o orçamento da API confirma sempre */
			});
	}, [booking.vehicle_id, currentEnd]);

	// Orçamento sempre que muda a data escolhida.
	useEffect(() => {
		if (!day) return;
		let cancelled = false;
		setChecking(true);
		setError(null);
		const endDate = cvToIso(localDateString(day), endCv.time);
		authFetch(`${endpoints.bookings.extensionQuote(booking.id)}?endDate=${encodeURIComponent(endDate)}`)
			.then(async (res) => {
				const body = await res.json().catch(() => null);
				if (!res.ok) throw new Error(body?.message || t("extendError"));
				if (!cancelled) setQuote(body as ExtensionQuote);
			})
			.catch((e) => !cancelled && (setQuote(null), setError((e as Error).message)))
			.finally(() => !cancelled && setChecking(false));
		return () => {
			cancelled = true;
		};
	}, [day, booking.id, endCv.time, t]);

	async function confirm() {
		if (!day || !quote?.available) return;
		setSending(true);
		setError(null);
		try {
			const res = await authFetch(endpoints.bookings.extendMine(booking.id), {
				method: "POST",
				body: JSON.stringify({ endDate: cvToIso(localDateString(day), endCv.time) }),
			});
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.message || t("extendError"));
			router.push(`/payment/${(body as BookingRow).id}`);
		} catch (e) {
			setError((e as Error).message || t("extendError"));
			setSending(false);
		}
	}

	return (
		<div className="rv-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
			<div ref={dialogRef} tabIndex={-1} className="rv-dialog" role="dialog" aria-modal="true" aria-labelledby="ext-title">
				<button type="button" className="rv-dialog__close" onClick={onClose} aria-label={t("extendBack")}>
					<X size={20} aria-hidden="true" />
				</button>
				<h2 id="ext-title" className="rv-dialog__title">{t("extendTitle")}</h2>
				<p className="rv-dialog__vehicle">{booking.vehicle_title}</p>
				<p className="mb-4 text-sm text-slate-600">{t("extendIntro")}</p>
				<p className="mb-4 text-sm">
					<span className="font-semibold">{t("extendCurrentEnd")}</span> {fmtDateTime(currentEnd)}
				</p>

				<div className="rv-field">
					<label htmlFor="ext-date">{t("extendNewEnd")}</label>
					<DatePicker
						id="ext-date"
						selected={day}
						onChange={(d: Date | null) => setDay(d)}
						dateFormat={PICKER_DATE_FORMAT}
						locale={dateFnsLocale(locale)}
						minDate={minDay}
						openToDate={day ?? minDay}
						excludeDateIntervals={booked}
						placeholderText={PICKER_DATE_FORMAT.toLowerCase()}
						className="form-control w-full"
						autoComplete="off"
					/>
					<p className="mt-1 text-xs text-slate-500">{t("extendSameTime", { time: endCv.time })}</p>
				</div>

				{checking && (
					<p className="flex items-center gap-2 text-sm text-slate-600" role="status">
						<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {t("extendChecking")}
					</p>
				)}
				{!checking && quote && quote.available && (
					<div className="my-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm" role="status">
						<p className="m-0">{t("extendDays", { days: quote.days })}</p>
						<p className="m-0 mt-1 text-base font-bold">
							{t("extendTotal")} {money(quote.total)}
						</p>
					</div>
				)}
				{!checking && quote && !quote.available && (
					<p role="alert" className="my-3 text-sm text-red-700">{quote.message}</p>
				)}
				{error && <p role="alert" className="my-3 text-sm text-red-700">{error}</p>}

				<div className="mt-4 flex gap-3">
					<button
						type="button"
						className="btn-racv flex-1 text-sm disabled:opacity-60"
						onClick={confirm}
						disabled={!quote?.available || checking || sending}
					>
						{sending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : t("extendConfirm")}
					</button>
					<button
						type="button"
						onClick={onClose}
						className="flex-1 rounded-lg border border-slate-300 !bg-white py-2 !text-sm !font-bold !text-slate-700 hover:!bg-slate-50"
					>
						{t("extendBack")}
					</button>
				</div>
			</div>
		</div>
	);
}
