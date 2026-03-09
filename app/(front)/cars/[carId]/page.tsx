import PageHeader from "@/app/ui/front/PageHeader";
import VehicleSingle from "@/app/ui/front/veiculos/single/singlecar";
import { Vehicle } from "@/lib/api/types";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ carId: string }> }): Promise<Metadata> {
	const { carId } = await params;

	try {
		const res = await fetch(`${API_BASE_URL}/public/vehicles/${carId}`, { cache: 'no-store' });
		if (!res.ok) return { title: 'Veículo não encontrado' };

		const vehicle: Vehicle = await res.json();

		return {
			title: `Alugar ${vehicle.make} ${vehicle.model}`,
			description: `Alugue este impecável ${vehicle.make} ${vehicle.model} por apenas ${vehicle.pricePerDay} CVE/dia. Reserve já com a Verde CV!`,
			openGraph: {
				title: `Alugar ${vehicle.make} ${vehicle.model} | Verde CV`,
				description: `Alugue este impecável ${vehicle.make} ${vehicle.model} por apenas ${vehicle.pricePerDay} CVE/dia.`,
				images: vehicle.images?.[0] ? [{ url: `${API_BASE_URL}${vehicle.images[0].url}` }] : []
			}
		};
	} catch (e) {
		return { title: 'Veículo' };
	}
}

export default async function CarId({ params }: { params: Promise<{ carId: string }> }) {
	const { carId } = await params;
	let vehicle: Vehicle | null = null;

	try {
		const res = await fetch(`${API_BASE_URL}/public/vehicles/${carId}`, { cache: 'no-store' });
		if (res.ok) {
			vehicle = await res.json();
		}
	} catch (error) {
		console.error("Error fetching vehicle details:", error);
	}

	return (
		<div>
			<PageHeader titulo={vehicle ? `${vehicle.make} ${vehicle.model}` : "Veículo não encontrado"} descricao="Sobre a Rent-A-Car Verde" />

			{vehicle && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org/",
							"@type": "Product",
							"name": `${vehicle.make} ${vehicle.model}`,
							"image": vehicle.images?.[0]?.url ? `${API_BASE_URL}${vehicle.images[0].url}` : "",
							"description": `Alugue este ${vehicle.make} ${vehicle.model}`,
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
					Veículo não encontrado.
				</div>
			)}
		</div>
	);
}
