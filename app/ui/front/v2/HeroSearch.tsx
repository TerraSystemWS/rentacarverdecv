"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocale, useTranslations } from "next-intl";
import { dateFnsLocale, PICKER_DATE_FORMAT } from "@/lib/i18n/dateLocale";
import { localDateString, parseLocalDate } from "@/lib/utils/cvTime";
import { useRentalLocations } from "@/lib/api/useRentalLocations";
import { tr } from "@/lib/i18n/translate";

// Pesquisa do topo da página inicial (local + datas → /cars). Usada no topo
// com a foto de Santiago e no topo com os banners das publicidades.
export default function HeroSearch() {
	const t = useTranslations("v2.hero");
	const ts = useTranslations("search");
	const locale = useLocale();
	const router = useRouter();
	const { locations, loading } = useRentalLocations();
	const [pickupLocation, setPickupLocation] = useState("");
	const [pickupDate, setPickupDate] = useState("");
	const [returnDate, setReturnDate] = useState("");

	function submit(e: React.FormEvent) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (pickupLocation) params.set("loc", pickupLocation);
		if (pickupDate) params.set("date", pickupDate);
		if (returnDate) params.set("end", returnDate);
		router.push(`/cars${params.toString() ? `?${params}` : ""}`);
	}

	return (
		<form className="v2-search" onSubmit={submit} aria-label={t("searchLabel")}>
			<div>
				<label htmlFor="v2-pickup">{ts("pickupLocation")}</label>
				<select id="v2-pickup" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} disabled={loading}>
					<option value="">{loading ? ts("loadingLocations") : ts("chooseLocation")}</option>
					{locations.map((l) => (
						<option key={l.id} value={l.id}>{tr(l, "name", locale)}</option>
					))}
				</select>
			</div>
			<div>
				<label htmlFor="v2-start">{ts("pickupDate")}</label>
				<DatePicker
					id="v2-start"
					selected={parseLocalDate(pickupDate)}
					onChange={(d: Date | null) => {
						const v = d ? localDateString(d) : "";
						setPickupDate(v);
						if (returnDate && v && returnDate < v) setReturnDate("");
					}}
					dateFormat={PICKER_DATE_FORMAT}
					locale={dateFnsLocale(locale)}
					minDate={new Date()}
					placeholderText={ts("datePlaceholder")}
					autoComplete="off"
				/>
			</div>
			<div>
				<label htmlFor="v2-end">{ts("returnDate")}</label>
				<DatePicker
					id="v2-end"
					selected={parseLocalDate(returnDate)}
					onChange={(d: Date | null) => setReturnDate(d ? localDateString(d) : "")}
					dateFormat={PICKER_DATE_FORMAT}
					locale={dateFnsLocale(locale)}
					minDate={parseLocalDate(pickupDate) ?? new Date()}
					placeholderText={ts("datePlaceholder")}
					autoComplete="off"
				/>
			</div>
			<button type="submit" className="v2-search__submit">{t("submit")}</button>
		</form>
	);
}
