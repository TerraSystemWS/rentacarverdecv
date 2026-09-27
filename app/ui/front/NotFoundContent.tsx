import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFoundContent() {
	const t = useTranslations("notFound");
	return (
		<section className="nf-page">
			<div className="nf-inner">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src="/assets/images/404-verde.png" alt={t("alt")} className="nf-illustration" width={534} height={337} />
				<h1 className="nf-title">{t("title")}</h1>
				<p className="nf-text">{t("text")}</p>
				<div className="nf-actions">
					<Link href="/" className="btn-racv nf-btn">{t("home")}</Link>
					<Link href="/cars" className="nf-btn nf-btn-outline">{t("cars")}</Link>
				</div>
				<p className="nf-links">
					<Link href="/contact">{t("contact")}</Link>
					<span aria-hidden="true">·</span>
					<Link href="/posts">{t("news")}</Link>
				</p>
			</div>
		</section>
	);
}
