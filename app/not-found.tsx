import React from "react";
import Link from "next/link";

export default function NotFound() {
	return (
		//  <!-- ====== Page Header ====== -->
		<div className="page-header bg-gray-color pd-404">
			<div className="container">
				<div className="row">
					<div className="col-md-6">
						<div className="main-content text-center">
							{/* Imagem separada */}
							<div className="mb-4">
								<img
									src="/assets/images/404.png"
									alt="Erro 404 - Página não encontrada"
								/>
							</div>

							{/* Texto */}
							<div className="text-content">
								<h3 className="red-color">Página não encontrada</h3>
								<p className="mb-3">
									A página que procura não existe ou foi movida.
								</p>
								<Link href="/" className="button color-black">
									Voltar ao Início
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
