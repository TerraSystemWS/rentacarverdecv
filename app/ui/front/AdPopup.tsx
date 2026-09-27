"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Advertisement } from "@/lib/api/types";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { useTranslations } from "next-intl";

const SESSION_KEY = "racv_popup_ad_dismissed";

// Popup site-wide para o placement POPUP — mostra-se no máximo uma vez por
// sessão de browser, com um pequeno atraso para não interromper o
// carregamento inicial da página.
const AdPopup: React.FC = () => {
	const t = useTranslations("ads");
	const [ad, setAd] = useState<Advertisement | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (sessionStorage.getItem(SESSION_KEY)) return;

		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.ads.list("POPUP")}`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data: Advertisement[]) => {
				if (cancelled || !data || data.length === 0) return;
				setAd(data[0]);
				setTimeout(() => setVisible(true), 1500);
			})
			.catch(() => { /* sem popup se falhar */ });
		return () => { cancelled = true; };
	}, []);

	function close() {
		setVisible(false);
		sessionStorage.setItem(SESSION_KEY, "1");
	}

	function handleClick() {
		if (ad?.id) {
			fetch(`${API_BASE_URL}${endpoints.ads.click(ad.id)}`, { method: "POST" }).catch(() => {});
		}
	}

	if (!ad || !visible) return null;

	const imageSrc = ad.imageUrl?.startsWith("/uploads") ? `${API_BASE_URL}${ad.imageUrl}` : ad.imageUrl;

	return (
		<div
			style={{
				position: "fixed", inset: 0, zIndex: 9998,
				background: "rgba(0,0,0,0.6)",
				display: "flex", alignItems: "center", justifyContent: "center",
			}}
			onClick={close}
		>
			<div
				style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh" }}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={close}
					aria-label={t("close")}
					style={{
						position: "absolute", top: -14, right: -14, zIndex: 1,
						background: "#fff", borderRadius: "9999px", width: 32, height: 32,
						display: "flex", alignItems: "center", justifyContent: "center",
						boxShadow: "0 2px 8px rgba(0,0,0,0.3)", border: "none", cursor: "pointer",
					}}
				>
					<X size={18} />
				</button>
				<a href={ad.linkUrl || "#"} onClick={handleClick}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={imageSrc} alt={ad.title} style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 8, display: "block" }} />
				</a>
			</div>
		</div>
	);
};

export default AdPopup;
