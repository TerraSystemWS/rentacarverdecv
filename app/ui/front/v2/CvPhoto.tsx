"use client";

import { useTranslations } from "next-intl";
import { cvPhotoSrc, type CvPhotoKey } from "./photos";

// Foto de Cabo Verde ou, enquanto o cliente não a enviar, um espaço
// reservado nas cores do site com o nome da foto em falta.
export default function CvPhoto({ photo, alt, eager = false }: { photo: CvPhotoKey; alt: string; eager?: boolean }) {
	const t = useTranslations("v2");
	const src = cvPhotoSrc(photo);
	if (src) {
		return (
			<div className="v2-photo">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={src} alt={alt} loading={eager ? "eager" : "lazy"} />
			</div>
		);
	}
	return (
		<div className="v2-photo v2-photo--placeholder" role="img" aria-label={alt}>
			<span className="v2-photo__label">{t("photoPending", { name: alt })}</span>
		</div>
	);
}
