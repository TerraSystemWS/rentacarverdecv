import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Headi from "./ui/front/head";
import Navbar from "./ui/front/navbar";
import Footer from "./ui/front/footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Rentacar Verde",
	description: "Plataforma de aluguer de carros em Cabo Verde",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="pt">
			<head>
				<Headi />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Navbar />
				{children}
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

				{/* Inicialização */}
				<Script id="rev-init" strategy="afterInteractive">
					{`
                        jQuery(document).ready(function() {
                        var $sliderSelector = jQuery(".carrent-slider");
                        if ($sliderSelector.revolution === undefined) {
                            console.error("Revolution Slider não carregou.");
                        } else {
                            $sliderSelector.revolution({
                            sliderType: "standard",
                            sliderLayout: "fullwidth",
                            delay: 9000,
                            navigation: {
                                arrows: { style: "gyges", enable: true }
                            },
                            responsiveLevels:[1400,1368,992,480],
                            gridwidth:[1400,1368,992,480],
                            gridheight:[600,600,500,380],
                            disableProgressBar:"on"
                            });
                        }
                        });
                    `}
				</Script>
			</body>
		</html>
	);
}
