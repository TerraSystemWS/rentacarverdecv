import { Vehicle } from "@/lib/api/types";
import { Settings2, Fuel } from "lucide-react";

import { API_BASE_URL } from "@/lib/api/endpoints";

type CarroProps = {
	car: Vehicle;
};

const Carro: React.FC<CarroProps> = ({ car }) => {
	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `${API_BASE_URL}${url}`;
		}
		return url;
	};

	const firstImage = car.images && car.images.length > 0 ? getImageSrc(car.images[0].url) : "";

	return (
		<div className="vehicle-content theme-yellow h-full flex flex-col">
			<div className="vehicle-thumbnail">
				<a href={`/cars/${car.id}`}>
					<img src={firstImage} alt={`${car.make} ${car.model}`} className="w-full !h-48 !object-cover" />
				</a>
			</div>
			<div className="vehicle-bottom-content p-4 flex-grow flex flex-col">
				<h2 className="vehicle-title text-xl font-semibold mb-2">
					<a href={`/cars/${car.id}`}>{car.make} {car.model}</a>
				</h2>
				<div className="vehicle-meta mt-auto flex flex-col gap-3">
					<div className="flex items-center gap-4 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
						<div className="flex items-center gap-1.5">
							<Settings2 className="w-3.5 h-3.5 text-yellow-600" />
							<span>{car.gearbox || "N/A"}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Fuel className="w-3.5 h-3.5 text-yellow-600" />
							<span>{car.fuelType || "N/A"}</span>
						</div>
					</div>
					<div className="meta-item pt-2 border-t border-gray-100 italic">
						<span className="font-black text-yellow-600 text-lg">
							{car.pricePerDay?.toLocaleString('pt-CV', { style: 'currency', currency: 'CVE' })}
						</span>
						<span className="text-gray-400 text-[10px] uppercase font-bold ml-1">/ Dia</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Carro;
