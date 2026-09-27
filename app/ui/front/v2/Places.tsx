"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import CvPhoto from "./CvPhoto";
import type { CvPhotoKey } from "./photos";

// "Para onde ir a partir da Praia": destinos de Santiago com o tempo de
// carro desde a agência. É a secção que mostra Cabo Verde e liga as
// paisagens ao motivo para alugar um carro.
const PLACES: CvPhotoKey[] = ["tarrafal", "cidadeVelha", "serraMalagueta", "assomada"];

export default function Places() {
	const t = useTranslations("v2.places");
	return (
		<section className="v2-section v2-section--sea">
			<div className="container">
				<div className="v2-head">
					<h2>{t("title")}</h2>
					<p>{t("lead")}</p>
				</div>
				<div className="v2-places">
					{PLACES.map((key) => (
						<article key={key} className="v2-place">
							<CvPhoto photo={key} alt={t(`${key}.name`)} />
							<div className="v2-place__body">
								<span className="v2-place__time">
									<Clock size={14} aria-hidden="true" /> {t(`${key}.time`)}
								</span>
								<h3>{t(`${key}.name`)}</h3>
								<p>{t(`${key}.text`)}</p>
							</div>
						</article>
					))}
				</div>
				<p className="v2-places__note">{t("note")}</p>
			</div>
		</section>
	);
}
