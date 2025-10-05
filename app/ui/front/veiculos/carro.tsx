import React from "react";
// import { Car } from "@lib/cars";

export type Car = {
	id: number;
	modelo: string;
	precoDia: number;
	precoKm: number;
	imagem: string;
	link?: string;
};
type CarroProps = {
	car: Car;
};

const Carro: React.FC<CarroProps> = ({ car }) => {
	return (
		<div className="vehicle-content theme-yellow">
			<div className="vehicle-thumbnail">
				<a href={car.link || "#"}>
					<img src={car.imagem} alt="car-item" />
				</a>
			</div>
			<div className="vehicle-bottom-content">
				<h2 className="vehicle-title">
					<a href={car.link || "#"}>{car.modelo}</a>
				</h2>
				<div className="vehicle-meta">
					<div className="meta-item">
						<span>Rent: ${car.precoDia} / </span> Day, - ${car.precoKm} / Km,
					</div>
				</div>
			</div>
		</div>
	);
};

export default Carro;
