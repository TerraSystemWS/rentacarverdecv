import React from "react";
import { Vehicle } from "@/lib/api/types";

type CarroProps = {
	car: Vehicle;
};

const Carro: React.FC<CarroProps> = ({ car }) => {
	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `http://localhost:8090${url}`;
		}
		return url;
	};

	const firstImage = car.images && car.images.length > 0 ? getImageSrc(car.images[0].url) : "";

	return (
		<div className="vehicle-content theme-yellow">
			<div className="vehicle-thumbnail">
				<a href={`/cars/${car.id}`}>
					<img src={firstImage} alt={`${car.make} ${car.model}`} />
				</a>
			</div>
			<div className="vehicle-bottom-content">
				<h2 className="vehicle-title">
					<a href={`/cars/${car.id}`}>{car.make} {car.model}</a>
				</h2>
				<div className="vehicle-meta">
					<div className="meta-item">
						<span>Aluguer: {car.pricePerDay?.toLocaleString('pt-CV', { style: 'currency', currency: 'CVE' })} / </span> Dia
					</div>
				</div>
			</div>
		</div>
	);
};

export default Carro;
