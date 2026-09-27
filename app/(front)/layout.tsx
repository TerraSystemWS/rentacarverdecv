import { ContentProvider } from "@/app/context/ContentContext";
import ClientFrontLayout from "../ui/front/ClientFrontLayout";
import type { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Metadados do site público na língua escolhida (ver i18n/). "absolute": as
// páginas sem título próprio mostram este tal como está (sem o template).
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("meta");
	return {
		title: {
			absolute: t("defaultTitle"),
			template: "%s | Rent a Car Verde",
		},
		description: t("description"),
		keywords: ["rent a car", "car hire", "aluguer de carros", "location de voitures", "cabo verde", "cape verde", "praia"],
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
		authors: [{ name: "Rent a Car Verde" }],
		icons: { icon: "/favicon.ico" },
		openGraph: {
			title: "Rent a Car Verde",
			description: t("description"),
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
			locale: t("ogLocale"),
			type: "website",
		},
	};
}

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
