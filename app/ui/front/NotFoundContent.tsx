import Link from "next/link";

// Conteúdo da página 404 — usado por app/(front)/not-found.tsx (com cabeçalho e
// rodapé do site) e pelo fallback app/not-found.tsx. Não depende das classes do
// template (a antiga "page-header pd-404" metia a ilustração como fundo e o
// texto ficava por cima): estilo em .nf-* (globals.css, sem @layer).
export default function NotFoundContent() {
	return (
		<section className="nf-page">
			<div className="nf-inner">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src="/assets/images/404-verde.png" alt="Erro 404 — carro virado ao contrário" className="nf-illustration" width={534} height={337} />
				<h1 className="nf-title">Página não encontrada</h1>
				<p className="nf-text">A página que procura não existe ou foi movida.</p>
				<div className="nf-actions">
					<Link href="/" className="btn-racv nf-btn">Voltar ao Início</Link>
					<Link href="/cars" className="nf-btn nf-btn-outline">Ver viaturas</Link>
				</div>
				<p className="nf-links">
					<Link href="/contact">Contacto</Link>
					<span aria-hidden="true">·</span>
					<Link href="/posts">Novidades</Link>
				</p>
			</div>
		</section>
	);
}
