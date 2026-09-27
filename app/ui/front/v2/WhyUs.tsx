"use client";

import { Plane, CreditCard, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

// Substitui a faixa escura dos números ("0 condutores", "4 carros...").
const ITEMS = [
	{ key: "airport", Icon: Plane },
	{ key: "payment", Icon: CreditCard },
	{ key: "electric", Icon: Zap },
] as const;

export default function WhyUs() {
	const t = useTranslations("v2.why");
	return (
		<section className="v2-section">
			<div className="container">
				<div className="v2-head">
					<h2>{t("title")}</h2>
				</div>
				<div className="v2-why">
					{ITEMS.map(({ key, Icon }) => (
						<div key={key} className="v2-why__item">
							<Icon size={34} strokeWidth={1.8} aria-hidden="true" />
							<h3>{t(`${key}.title`)}</h3>
							<p>{t(`${key}.text`)}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
