import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Add this to your layout.tsx or main CSS file
import Script from "next/script";
import Header from "./ui/front/minis/Header";
import Footer from "./ui/front/footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt">
			<head>
				{/* Fontes personalizadas */}
				<link
					href="https://fonts.googleapis.com/css?family=Exo:400,400i,500,500i,600,600i,700,700i,800,800i,900,900i%7cRoboto+Slab:400,700"
					rel="stylesheet"
				/>

				{/* CSS principal */}
				<link rel="stylesheet" href="/assets/css/plugins.min.css" />
				<link rel="stylesheet" href="/assets/css/icons.min.css" />
				<link rel="stylesheet" href="/assets/css/style.css" />
				<link rel="stylesheet" href="/assets/css/color-schemer.css" />

				{/* Revolution Slider CSS */}
				<link rel="stylesheet" href="/assets/revolution/css/settings.css" />
				<link rel="stylesheet" href="/assets/revolution/css/layers.css" />
				<link rel="stylesheet" href="/assets/revolution/css/navigation.css" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Header />
				<main>{children}</main>
				<Footer />

				{/* jQuery primeiro */}
				<Script
					src="https://code.jquery.com/jquery-3.6.4.min.js"
					strategy="beforeInteractive"
				/>

				{/* Revolution Slider Core */}
				<Script
					src="/assets/revolution/js/jquery.themepunch.tools.min.js"
					strategy="afterInteractive"
				/>
				<Script
					src="/assets/revolution/js/jquery.themepunch.revolution.min.js"
					strategy="afterInteractive"
				/>

				{/* Extensões */}
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.video.min.js"
					strategy="afterInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.slideanims.min.js"
					strategy="afterInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.actions.min.js"
					strategy="afterInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.layeranimation.min.js"
					strategy="afterInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.kenburn.min.js"
					strategy="afterInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.navigation.min.js"
					strategy="afterInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.migration.min.js"
					strategy="afterInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.parallax.min.js"
					strategy="afterInteractive"
				/>

				{/* Inicialização do Revolution Slider */}
				<Script
					id="revolution-init"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
              (function() {
                function initRevolution() {
                  if (typeof jQuery !== 'undefined' && typeof jQuery.fn.revolution !== 'undefined') {
                    var $sliderSelector = jQuery(".carrent-slider");
                    if ($sliderSelector.length) {
                      $sliderSelector.revolution({
                        sliderType: "standard",
                        sliderLayout: "fullwidth",
                        delay: 9000,
                        navigation: { 
                          arrows: { 
                            style: "gyges", 
                            enable: true 
                          } 
                        },
                        responsiveLevels: [1400,1368,992,480],
                        gridwidth: [1400,1368,992,480],
                        gridheight: [600,600,500,380],
                        disableProgressBar: "on"
                      });
                    }
                  } else {
                    // Tenta novamente após um breve delay se os scripts não carregaram
                    setTimeout(initRevolution, 100);
                  }
                }

                // Inicia quando o documento estiver pronto
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initRevolution);
                } else {
                  initRevolution();
                }
              })();
            `,
					}}
				/>
			</body>
		</html>
	);
}
