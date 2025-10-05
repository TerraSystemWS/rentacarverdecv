// PageHeader.tsx
"use client";

import React from "react";

interface PageHeaderProps {
	titulo: string;
	descricao: string;
}

export default function PageHeader({
	titulo = "Sobre",
	descricao = "Sobre a sua empresa",
}: PageHeaderProps) {
	return (
		<div
			className="page-header background-overlay"
			style={{ backgroundImage: "url(/assets/images/page-header-one.png)" }}
		>
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<h2 className="page-title">{titulo}</h2>
						<p className="page-description">{descricao}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
