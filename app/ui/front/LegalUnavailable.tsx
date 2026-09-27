import { useTranslations } from "next-intl";

export default function LegalUnavailable() {
	const t = useTranslations("legal");
	return (
		<p className="text-slate-600">
			{t.rich("unavailable", {
				email: (chunks) => (
					<a href="mailto:reservas@rentacarverde.cv" className="text-green-700 font-semibold underline">{chunks}</a>
				),
			})}
		</p>
	);
}
