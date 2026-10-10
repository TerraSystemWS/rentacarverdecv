"use client";

import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import type { PublicReviews } from "@/lib/api/types";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { StarsView } from "./Stars";
import { TestimonialCard } from "../v2/Testimonials";

// Página do carro: avaliações aprovadas deste carro. A lista aparece logo
// com a primeira aprovada; a média só depois de 3 clientes diferentes
// (vem em vehicle.ratingAverage, ver VehicleRatingService no backend).
export default function VehicleReviews({ vehicleId, average }: { vehicleId: number; average?: number | null }) {
	const t = useTranslations("reviews");
	const format = useFormatter();
	const [data, setData] = useState<PublicReviews | null>(null);

	useEffect(() => {
		fetch(`${API_BASE_URL}${endpoints.reviews.forVehicle(vehicleId)}`)
			.then((res) => (res.ok ? res.json() : null))
			.then(setData)
			.catch(() => setData(null));
	}, [vehicleId]);

	if (!data || data.items.length === 0) return null;

	return (
		<section className="v2-section v2-testimonials" aria-labelledby="vehicle-reviews-title">
			<div className="container">
				<div className="v2-testimonials__top">
					<div className="v2-head">
						<h2 id="vehicle-reviews-title">{t("vehicleSectionTitle")}</h2>
						<p>{t("vehicleSectionLead")}</p>
					</div>
					{average != null && (
						<div className="v2-testimonials__score">
							<span className="v2-testimonials__avg">{format.number(average, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</span>
							<div>
								<StarsView value={average} size={20} />
								<p>{t("basedOn", { count: data.count })}</p>
							</div>
						</div>
					)}
				</div>

				<ul className="v2-testimonials__list">
					{data.items.map((r) => <TestimonialCard key={r.id} review={r} />)}
				</ul>
			</div>
		</section>
	);
}
