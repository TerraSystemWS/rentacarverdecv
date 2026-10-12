import type { Metadata } from "next";
import { Exo, Roboto_Slab, Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import GoogleAnalytics from "./ui/GoogleAnalytics";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

const exo = Exo({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-exo",
});

// Letras do novo visual do site público (newUI): títulos e texto.
const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-display",
});
const figtree = Figtree({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-text",
});
const robotoSlab = Roboto_Slab({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto-slab",
});

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("meta");
	return {
	// Base dos URLs relativos (ex.: /og-image.png) nas pré-visualizações de links.
	metadataBase: new URL('https://www.rentacarverde.cv'),
	title: {
		template: '%s | Rent a Car Verde',
		default: t("defaultTitle"),
	},
	description: t("description"),
	openGraph: {
		title: 'Rent a Car Verde',
		description: t("description"),
		url: 'https://www.rentacarverde.cv',
		siteName: 'Rent a Car Verde',
		images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rent a Car Verde' }],
		locale: t("ogLocale"),
		type: 'website',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	};
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Língua do site público (cookie NEXT_LOCALE ou língua do browser) — ver i18n/.
	const locale = await getLocale();
	return (
		<html lang={locale}>
			<head>
				<GoogleAnalytics />
			</head>
			<body className={`antialiased ${exo.variable} ${robotoSlab.variable} ${bricolage.variable} ${figtree.variable}`}>
				<NextIntlClientProvider>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
