// Add this to your layout.tsx or main CSS file

import Header from "../ui/front/minis/Header";
import Footer from "../ui/front/footer";

// export const metadata: Metadata = {
// 	title: "Rentacar Verde",
// 	description: "Plataforma de aluguer de carros em Cabo Verde",
// };
// export const metadata = {
// 	title: {
// 		default: "Rent a Car Verde",
// 		template: "%s — Rent a Car Verde",
// 	},
// 	description: "Rentacarverde — rent your car in the easy way",
// 	keywords: ["car", "rent", "cabo verde", "aluguer de carros"],
// 	robots: "index, follow",
// 	authors: [{ name: "Rent-a-Car Verde" }],
// 	viewport: "width=device-width, initial-scale=1",
// 	icons: {
// 		icon: "/favicon.ico",
// 	},
// };

export const metadata = {
	title: {
		default: "Rent a Car Verde",
		template: "%s — Rent a Car Verde",
	},
	description: "Rentacarverde — rent your car in the easy way",
	keywords: ["car", "rent", "cabo verde", "aluguer de carros"],
	robots: {
		index: true,
		follow: true,
		// nocache: true,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	authors: [{ name: "Rent-a-Car Verde" }],
	viewport: "width=device-width, initial-scale=1",
	icons: { icon: "/favicon.ico" },
	openGraph: {
		title: "Rent a Car Verde",
		description: "Alugue o seu carro ideal em Cabo Verde com Rent a Car Verde",
		url: "[https://www.rentacarverde.cv](https://www.rentacarverde.cv)",
		siteName: "Rent a Car Verde",
		images: [
			{
				url: "/assets/images/og-image.png",
				width: 1200,
				height: 630,
				alt: "Rent a Car Verde",
			},
		],
		locale: "pt_PT",
		type: "website",
	},
};

// para gerar metadados dinâmicos para cada carro
//##############################################################################
// async function fetchCar(id: string) {
//   // Simula uma chamada de API para buscar os dados do carro
// export async function generateMetadata({ params }): Promise<Metadata> {
//   const car = await fetchCar(params.id);

//   return {
//     title: `${car.brand} ${car.model}`,
//     description: car.description,
//     keywords: ["rent a car", car.brand, car.model],
//   };
// }

// export async function generateMetadata({ params }): Promise<Metadata> {
//   const car = await getCarById(params.id);

//   return {
//     title: `${car.brand} ${car.model}`,
//     description: car.description,
//     openGraph: {
//       title: `${car.brand} ${car.model}`,
//       description: car.description,
//       images: [car.image],
//     },
//   };
// }

export default function FrontLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />
			<main>{children}</main>
			<Footer />
		</>
	);
}
