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
import { use } from "react";
import PageHeader from "@/app/ui/front/PageHeader";
import VehicleSingle from "@/app/ui/front/veiculos/single/singlecar";
import { vehiclesData } from "@/app/lib/singleCar";

const CarId = ({ params }: { params: Promise<{ carId: string }> }) => {
	const { carId } = use(params);
	return (
		// <h1>Car Details Page</h1>
		// <p>Car ID: {carId}</p>
		<div>
			<PageHeader titulo={carId} descricao="Sobre a Rent-A-Car Verde" />

			<VehicleSingle vehicle={vehiclesData[0]} />
			{/* Add more details about the car here */}
		</div>
	);
};

export default CarId;
