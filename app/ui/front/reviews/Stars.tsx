"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

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
