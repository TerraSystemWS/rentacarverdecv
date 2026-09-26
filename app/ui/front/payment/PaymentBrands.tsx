// Logos das marcas aceites no pagamento online (exigido pela checklist de
// validação do site da SISP, ponto 2). Os ficheiros vêm do pacote de
// desenvolvimento da SISP ("g. Logo das marcas aceites").
// Tamanho e alinhamento em .payment-brands (globals.css, sem @layer) — o CSS
// legado do template forçava as imagens para o tamanho original.
const BRANDS = [
	{ src: "/payment/vinti4.png", alt: "vinti4" },
	{ src: "/payment/visa-secure.png", alt: "Visa Secure" },
	{ src: "/payment/mastercard-idcheck.png", alt: "Mastercard ID Check", wide: true },
	{ src: "/payment/amex.jpg", alt: "American Express" },
];

// onLight: em páginas de fundo claro mantém um fundo escuro discreto — o logo
// Mastercard ID Check fornecido pela SISP tem letras brancas.
export default function PaymentBrands({ onLight = false, className = "" }: { onLight?: boolean; className?: string }) {
	return (
		<div className={`payment-brands${onLight ? " payment-brands--on-light" : ""} ${className}`}>
			{BRANDS.map((b) => (
				// eslint-disable-next-line @next/next/no-img-element
				<img key={b.alt} src={b.src} alt={b.alt} className={b.wide ? "payment-brand-wide" : undefined} />
			))}
		</div>
	);
}
