import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Providers from "./providers";

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
			</head>
			<body className="antialiased">
				<Providers>{children}</Providers>

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
