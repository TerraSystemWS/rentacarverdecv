import { ContentProvider } from "@/app/context/ContentContext";
import ClientFrontLayout from "../ui/front/ClientFrontLayout";

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
		url: "https://www.rentacarverde.cv",
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

export default function FrontLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Legacy CSS assets only for frontend */}
			<link rel="stylesheet" href="/assets/css/plugins.min.css" />
			<link rel="stylesheet" href="/assets/css/icons.min.css" />
			<link rel="stylesheet" href="/assets/css/style.css" />
			<link rel="stylesheet" href="/assets/css/color-schemer.css" />

			{/* Revolution Slider CSS */}
			<link rel="stylesheet" href="/assets/revolution/css/settings.css" />
			<link rel="stylesheet" href="/assets/revolution/css/layers.css" />
			<link rel="stylesheet" href="/assets/revolution/css/navigation.css" />

			<ContentProvider>
				<ClientFrontLayout>{children}</ClientFrontLayout>
			</ContentProvider>
		</>
	);
}
