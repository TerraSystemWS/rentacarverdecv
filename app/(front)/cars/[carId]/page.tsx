// Nomalmentemente
//#########################################
// export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = await params
//   return <div>My Post: {slug}</div>
// }

// Na Cliente componte tem opcao
//#########################################
// 'use client'
// import { use } from 'react'

// export default function BlogPostPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = use(params)

//   return (
//     <div>
//       <p>{slug}</p>
//     </div>
//   )
// }

// Alternativa com async/await (mas precisa ser componente de Servidor)
//#########################################

// const CarId = async ({ params }: { params: Promise<{ carId: string }> }) => {
// 	const { carId } = await params;

// 	return (
// 		<div>
// 			<h1>Car Details Page</h1>
// 			<p>Car ID: {carId}</p>
// 			{/* Add more details about the car here */}
// 		</div>
// 	);
// };

// "use client";
// import { use } from "react";
// const CarId = ({ params }: { params: Promise<{ carId: string }> }) => {
// 	const { carId } = use(params);
// 	return (
// 		<div>
// 			<h1>Car Details Page</h1>
// 			<p>Car ID: {carId}</p>
// 			{/* Add more details about the car here */}
// 		</div>
// 	);
// };

"use client";
import { use, useEffect, useState } from "react";
import PageHeader from "@/app/ui/front/PageHeader";
import VehicleSingle from "@/app/ui/front/veiculos/single/singlecar";
import { Vehicle } from "@/lib/api/types";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";

const CarId = ({ params }: { params: Promise<{ carId: string }> }) => {
	const { carId } = use(params);
	const [vehicle, setVehicle] = useState<Vehicle | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVehicle = async () => {
			try {
				const res = await authFetch(endpoints.vehicles.get(Number(carId)), { auth: false });
				if (res.ok) {
					const data = await res.json();
					setVehicle(data);
				}
			} catch (error) {
				console.error("Error fetching vehicle details:", error);
			} finally {
				setLoading(false);
			}
		};
		if (carId) fetchVehicle();
	}, [carId]);

	return (
		<div>
			<PageHeader titulo={vehicle ? `${vehicle.make} ${vehicle.model}` : "Carregando..."} descricao="Sobre a Rent-A-Car Verde" />

			{loading ? (
				<div className="container py-20 text-center">
					<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent" role="status"></div>
				</div>
			) : vehicle ? (
				<VehicleSingle vehicle={vehicle} />
			) : (
				<div className="container py-20 text-center text-muted-foreground">
					Veículo não encontrado.
				</div>
			)}
		</div>
	);
};

export default CarId;
