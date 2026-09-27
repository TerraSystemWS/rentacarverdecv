// PageHeader.tsx — cabeçalho das páginas interiores (visual v2: azul
// Atlântico com foto de Cabo Verde em fundo, quando houver).
"use client";

import React from "react";
import { cvPhotoSrc, type CvPhotoKey } from "./v2/photos";

interface PageHeaderProps {
	titulo: string;
	descricao: string;
	/** Foto de fundo (fotos do cliente em v2/photos.ts). Sem foto: só o azul. */
	foto?: CvPhotoKey;
}

export default function PageHeader({
	titulo = "Sobre",
	descricao = "Sobre a sua empresa",
	foto = "pages",
}: PageHeaderProps) {
	const src = cvPhotoSrc(foto);
	return (
		<header className="v2-pagehead">
			{src && <img className="v2-pagehead__img" src={src} alt="" aria-hidden="true" />}
			<div className="container v2-pagehead__inner">
				<h1 className="v2-pagehead__title">{titulo}</h1>
				{descricao && <p className="v2-pagehead__desc">{descricao}</p>}
			</div>
		</header>
	);
}
