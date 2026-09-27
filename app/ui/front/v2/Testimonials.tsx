"use client";

import { Quote } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { PublicReviews } from "@/lib/api/types";
import { StarsView } from "../reviews/Stars";

// "O que dizem os nossos clientes": avaliações aprovadas no dashboard
// (Conteúdo → Avaliações). Cada uma vem de uma reserva concluída; o texto é
// o do cliente, na língua em que o escreveu. Sem avaliações, não aparece.
export default function Testimonials({ data }: { data: PublicReviews | null }) {
	const t = useTranslations("reviews");
	const format = useFormatter();
	if (!data || data.items.length === 0) return null;

	return (
		<section className="v2-section v2-testimonials" aria-labelledby="v2-testimonials-title">
			<div className="container">
				<div className="v2-testimonials__top">
					<div className="v2-head">
						<h2 id="v2-testimonials-title">{t("sectionTitle")}</h2>
						<p>{t("sectionLead")}</p>
					</div>
					<div className="v2-testimonials__score">
						<span className="v2-testimonials__avg">{format.number(data.average, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</span>
						<div>
							<StarsView value={data.average} size={20} />
							<p>{t("basedOn", { count: data.count })}</p>
						</div>
					</div>
				</div>

				<ul className="v2-testimonials__list">
					{data.items.map((r) => (
						<li key={r.id} className="v2-testimonial">
							<Quote size={28} aria-hidden="true" className="v2-testimonial__mark" />
							<StarsView value={r.rating} size={16} />
							<blockquote lang={r.locale} className="v2-testimonial__text">{r.comment}</blockquote>
							<footer className="v2-testimonial__who">
								<span className="v2-testimonial__avatar" aria-hidden="true">{r.displayName.trim().charAt(0).toUpperCase()}</span>
								<span>
									<strong>{r.displayName}</strong>
									<span className="v2-testimonial__meta">
										{[r.city, r.vehicle ? t("rented", { vehicle: r.vehicle }) : null].filter(Boolean).join(" · ")}
									</span>
								</span>
							</footer>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
