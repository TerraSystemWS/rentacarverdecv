import PageHeader from "@/app/ui/front/PageHeader";
import { Driver } from "@/lib/api/types";
import { endpoints, API_BASE_URL, SERVER_API_BASE_URL } from "@/lib/api/endpoints";
import { getTranslations } from "next-intl/server";

async function getDrivers(): Promise<Driver[]> {
	try {
		const res = await fetch(`${SERVER_API_BASE_URL}${endpoints.drivers.list}`, { cache: "no-store" });
		if (!res.ok) return [];
		return await res.json();
	} catch {
		return [];
	}
}

function getImageSrc(url?: string | null) {
	if (!url) return "/assets/images/driver/avatar-placeholder.png";
	if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
	return url;
}

export default async function MotoristasPage() {
	const drivers = await getDrivers();
	const t = await getTranslations("driversPage");

	return (
		<>
			<PageHeader titulo={t("title")} descricao={t("desc")} />

			<div className="available-block vehicle-padding bg-gray-color">
				<div className="container">
					<div className="row">
						{drivers.length === 0 ? (
							<div className="col-md-12 text-center py-20 text-muted-foreground">
								{t("empty")}
							</div>
						) : (
							drivers.map((driver) => (
								<div className="col-md-4 col-sm-6" key={driver.id}>
									<div className="driver-content vehicle-content theme-yellow bg-green-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition h-full flex flex-col mb-8">
										<div className="driver-thumb vehicle-thumbnail flex bg-zinc-100 min-h-[220px] w-full">
											<img
												src={getImageSrc(driver.imageUrl)}
												alt={driver.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="vehicle-bottom-content p-4 text-center flex-grow">
											<h3 className="driver-name vehicle-title text-xl font-semibold">{driver.name}</h3>
											<h4 className="driver-desc text-gray-700 mt-2">{driver.description}</h4>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</>
	);
}
