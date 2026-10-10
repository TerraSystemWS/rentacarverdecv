"use client";

import { Star } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

/** Estrelas só para ver (avaliações publicadas). */
export function StarsView({ value, size = 18 }: { value: number; size?: number }) {
	const t = useTranslations("reviews");
	const rounded = Math.round(value);
	return (
		<span className="rv-stars" role="img" aria-label={t("stars", { n: rounded })}>
			{[1, 2, 3, 4, 5].map((i) => (
				<Star key={i} size={size} aria-hidden="true" className={i <= rounded ? "rv-star rv-star--on" : "rv-star"} />
			))}
		</span>
	);
}

/**
 * Média de um carro nos cartões e na página do carro. A API só manda
 * ratingAverage depois de 3 clientes diferentes (VehicleRatingService);
 * sem média não mostra nada.
 */
export function VehicleRating({ average, count, className = "" }: { average?: number | null; count?: number | null; className?: string }) {
	const t = useTranslations("reviews");
	const format = useFormatter();
	if (average == null) return null;
	const avg = format.number(average, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
	return (
		<span className={`rv-card-rating ${className}`} role="img" aria-label={t("ratingShort", { average: avg, count: count ?? 0 })}>
			<StarsView value={average} size={14} />
			<span aria-hidden="true"><strong>{avg}</strong> ({count ?? 0})</span>
		</span>
	);
}

/** Escolher de 1 a 5 estrelas (grupo de botões de rádio, funciona com teclado). */
export function StarsInput({ value, onChange, name }: { value: number; onChange: (n: number) => void; name: string }) {
	const t = useTranslations("reviews");
	return (
		<div className="rv-stars-input">
			{[1, 2, 3, 4, 5].map((i) => (
				<label key={i} className="rv-stars-input__option">
					<input type="radio" name={name} value={i} checked={value === i} onChange={() => onChange(i)} className="rv-sr-only" />
					<Star size={34} aria-hidden="true" className={i <= value ? "rv-star rv-star--on" : "rv-star"} />
					<span className="rv-sr-only">{t("stars", { n: i })}</span>
				</label>
			))}
		</div>
	);
}
