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
		<div className="page-header nevy-bg">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<h2 className="page-title">{titulo}</h2>
						<p className="page-description yellow-color">{descricao}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
