import PageHeader from "@/app/ui/front/PageHeader";
import VehicleSingle from "@/app/ui/front/veiculos/single/singlecar";
import { Vehicle } from "@/lib/api/types";
import { API_BASE_URL, SERVER_API_BASE_URL } from "@/lib/api/endpoints";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ carSlug: string }> }): Promise<Metadata> {
	const { carSlug } = await params;
	const t = await getTranslations("carPage");

	try {
		const res = await fetch(`${SERVER_API_BASE_URL}/public/vehicles/${carSlug}`, { cache: 'no-store' });
		if (!res.ok) return { title: t("notFound") };

		const vehicle: Vehicle = await res.json();
		const vars = { name: `${vehicle.make} ${vehicle.model}`, price: String(vehicle.pricePerDay ?? "") };

		return {
			title: t("metaTitle", vars),
			description: t("metaDescription", vars),
			openGraph: {
				title: `${t("metaTitle", vars)} | Rent a Car Verde`,
				description: t("metaDescription", vars),
				images: vehicle.images?.[0] ? [{ url: `${API_BASE_URL}${vehicle.images[0].url}` }] : []
			}
		};
	} catch (e) {
		return { title: t("vehicle") };
	}
}

export default async function CarSlug({ params }: { params: Promise<{ carSlug: string }> }) {
	const { carSlug } = await params;
	const t = await getTranslations("carPage");
	let vehicle: Vehicle | null = null;

	try {
		const res = await fetch(`${SERVER_API_BASE_URL}/public/vehicles/${carSlug}`, { cache: 'no-store' });
		if (res.ok) {
			vehicle = await res.json();
		}
	} catch (error) {
		console.error("Error fetching vehicle details:", error);
	}

	// O backend ainda aceita o id numérico antigo (/cars/32) por compatibilidade
	// com links já partilhados/indexados — mas a URL canónica passa a ser
	// sempre o slug (/cars/dacia-spring-2023). Redirect permanente (308) para
	// consolidar o SEO num único endereço por viatura.
	if (vehicle && vehicle.slug && carSlug !== vehicle.slug) {
		permanentRedirect(`/cars/${vehicle.slug}`);
	}

	return (
		<div>
			<PageHeader titulo={vehicle ? `${vehicle.make} ${vehicle.model}` : t("notFound")} descricao={t("headerDesc")} />

			{vehicle && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org/",
							"@type": "Product",
							"name": `${vehicle.make} ${vehicle.model}`,
							"image": vehicle.images?.[0]?.url ? `${API_BASE_URL}${vehicle.images[0].url}` : "",
							"description": t("ldDescription", { name: `${vehicle.make} ${vehicle.model}` }),
							"offers": {
								"@type": "Offer",
								"price": vehicle.pricePerDay,
								"priceCurrency": "CVE",
								"availability": "https://schema.org/InStock"
							}
						})
					}}
				/>
			)}

			{vehicle ? (
				<VehicleSingle vehicle={vehicle} />
			) : (
				<div className="container py-20 text-center text-muted-foreground">
					{t("notFoundText")}
				</div>
			)}
		</div>
	);
}
