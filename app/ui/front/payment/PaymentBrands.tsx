// Logos das marcas aceites no pagamento online (exigido pela checklist de
// validação do site da SISP, ponto 2). Os ficheiros vêm do pacote de
// desenvolvimento da SISP ("g. Logo das marcas aceites") — as versões
// Visa Secure e Mastercard ID Check são para fundo escuro.
const BRANDS = [
	{ src: "/payment/vinti4.png", alt: "vinti4", className: "h-8" },
	{ src: "/payment/visa-secure.png", alt: "Visa Secure", className: "h-8" },
	{ src: "/payment/mastercard-idcheck.png", alt: "Mastercard ID Check", className: "h-7" },
	{ src: "/payment/amex.jpg", alt: "American Express", className: "h-8" },
];

export default function PaymentBrands({ className = "" }: { className?: string }) {
	return (
		<div className={`inline-flex flex-wrap items-center gap-3 rounded-lg bg-slate-900 px-3 py-2 ${className}`}>
			{BRANDS.map((b) => (
				// eslint-disable-next-line @next/next/no-img-element
				<img key={b.alt} src={b.src} alt={b.alt} className={`${b.className} w-auto object-contain`} />
			))}
		</div>
	);
}
