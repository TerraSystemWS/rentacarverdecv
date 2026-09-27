import { ContentProvider } from "@/app/context/ContentContext";
import ClientFrontLayout from "../ui/front/ClientFrontLayout";
import type { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import { SERVER_API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import { themeCss } from "@/lib/theme/tokens";
import ThemePreview from "../ui/front/v2/ThemePreview";

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

// Tema de cores ativo (Definições → Aparência). Lido a cada pedido para a
// troca no dashboard aparecer logo; se o backend não responder, ficam as
// cores do v2.css (tema Atlântico).
async function activeThemeCss(): Promise<string> {
	try {
		const res = await fetch(`${SERVER_API_BASE_URL}${endpoints.themes.active}`, {
			cache: "no-store",
			signal: AbortSignal.timeout(1500),
		});
		if (!res.ok) return "";
		const theme = await res.json();
		return themeCss(theme?.colors, "body .site-v2");
	} catch {
		return "";
	}
}

export default async function FrontLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const css = await activeThemeCss();
	return (
		<>
			{/* Só variáveis --v2-* com cores #rrggbb validadas (lib/theme/tokens.ts) */}
			{css && <style id="site-theme" dangerouslySetInnerHTML={{ __html: css }} />}
			<ThemePreview />
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
