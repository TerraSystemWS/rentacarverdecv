import type { Metadata } from "next";
import { Exo, Roboto_Slab } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "./providers";
import GoogleAnalytics from "./ui/GoogleAnalytics";

const exo = Exo({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-exo",
});

const robotoSlab = Roboto_Slab({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
	title: {
		template: '%s | Verde CV Rent a Car',
		default: 'Verde CV Rent a Car | Aluguer de Carros em Cabo Verde',
	},
	description: 'A melhor experiência de aluguer de viaturas comerciais e de passageiros em Cabo Verde.',
	openGraph: {
		title: 'Verde CV Rent a Car',
		description: 'A melhor experiência de aluguer de viaturas comerciais e de passageiros em Cabo Verde.',
		url: 'https://rentacarverdecv.com', // Placeholder URL
		siteName: 'Verde CV',
		images: [{ url: '/assets/images/slider/1.jpg', width: 1200, height: 630 }], // Placeholder OGP image
		locale: 'pt_PT',
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt">
			<head>
				<GoogleAnalytics />
			</head>
			<body className={`antialiased ${exo.variable} ${robotoSlab.variable}`}>
				<Providers>{children}</Providers>

				{/* jQuery primeiro */}
				<Script
					src="https://code.jquery.com/jquery-3.6.4.min.js"
					strategy="beforeInteractive"
				/>

				{/* Revolution Slider Core */}
				<Script
					src="/assets/revolution/js/jquery.themepunch.tools.min.js"
					strategy="beforeInteractive"
				/>
				<Script
					src="/assets/revolution/js/jquery.themepunch.revolution.min.js"
					strategy="beforeInteractive"
				/>

				{/* Extensões */}
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.video.min.js"
					strategy="beforeInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.slideanims.min.js"
					strategy="beforeInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.actions.min.js"
					strategy="beforeInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.layeranimation.min.js"
					strategy="beforeInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.kenburn.min.js"
					strategy="beforeInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.navigation.min.js"
					strategy="beforeInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.migration.min.js"
					strategy="beforeInteractive"
				/>
				<Script
					src="/assets/revolution/js/extensions/revolution.extension.parallax.min.js"
					strategy="beforeInteractive"
				/>

				{/* Inicialização do Revolution Slider */}
				<Script
					id="revolution-init"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `
              window.initRevolutionSlider = function() {
                setTimeout(function() {
                  if (typeof jQuery !== 'undefined' && typeof jQuery.fn.revolution !== 'undefined') {
                    try {
                      var $sliderSelector = jQuery(".carrent-slider");
                      if ($sliderSelector.length === 0) return;
                      
                      if ($sliderSelector.hasClass("revslider-initialised")) {
                          // Destroying it might throw if _R isn't fully established, so catch errors
                          try { $sliderSelector.revkill(); } catch(e) {}
                      }

                      $sliderSelector.show().revolution({
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
                    } catch(e) {
                      console.warn("Revolution Slider Initialization Error:", e);
                    }
                  }
                }, 300); // Small threshold for DOM attachments
              };
            `,
					}}
				/>
			</body>
		</html>
	);
}
