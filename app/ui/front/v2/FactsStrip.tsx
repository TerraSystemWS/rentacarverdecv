"use client";

import React from "react";
import CountUp from "react-countup";
import { CarFront, Smile, IdCard, CalendarDays, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";

// Números da empresa (substitui a faixa escura do FunFactsBlock). Carros,
// clientes e condutores vêm da contagem real (/public/stats); o 4.º número e
// os textos são editáveis no dashboard (Conteúdo → home.funFacts). Um número
// a zero não aparece — "0 condutores" não diz nada ao cliente.
type FunFacts = {
	f1?: string; f2?: string; f3?: string; f4?: string;
	f4Num?: number | string;
};

export default function FactsStrip({ content }: { content?: FunFacts }) {
	const t = useTranslations("funFacts");
	const tv = useTranslations("v2.facts");
	const [stats, setStats] = React.useState<{ vehicles: number; clients: number; drivers: number } | null>(null);

	React.useEffect(() => {
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.content.stats}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (cancelled || !data) return;
				setStats({
					vehicles: data.vehiclesCount ?? 0,
					clients: data.clientsCount ?? 0,
					drivers: data.driversCount ?? 0,
				});
			})
			.catch(() => { /* sem números, a faixa não aparece */ });
		return () => {
			cancelled = true;
		};
	}, []);

	const facts: { key: string; value: number; label: string; Icon: LucideIcon }[] = [
		{ key: "vehicles", value: stats?.vehicles ?? 0, label: content?.f1 || t("vehicles"), Icon: CarFront },
		{ key: "clients", value: stats?.clients ?? 0, label: content?.f2 || t("customers"), Icon: Smile },
		{ key: "drivers", value: stats?.drivers ?? 0, label: content?.f3 || t("drivers"), Icon: IdCard },
		{ key: "days", value: Number(content?.f4Num) || 0, label: content?.f4 || t("days"), Icon: CalendarDays },
	].filter((f) => f.value > 0);

	if (!stats || facts.length === 0) return null;

	const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

	return (
		<section className="v2-facts" aria-label={tv("label")}>
			<div className="container">
				<ul className={`v2-facts__list v2-facts__list--${facts.length}`}>
					{facts.map(({ key, value, label, Icon }) => (
						<li key={key} className="v2-facts__item">
							<span className="v2-facts__icon" aria-hidden="true">
								<Icon size={26} strokeWidth={1.8} />
							</span>
							<span className="v2-facts__text">
								<strong className="v2-facts__num">
									{reduceMotion ? value.toLocaleString() : <CountUp end={value} duration={2} separator=" " enableScrollSpy scrollSpyOnce />}
								</strong>
								<span className="v2-facts__label">{label}</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
