"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import { useTranslations } from "next-intl";
import FeedbackDialog, { type FeedbackSource } from "./FeedbackDialog";

/** Abre a janela "Reportar um problema": link de texto (rodapé do site) ou ícone (barra do painel). */
export default function FeedbackButton({ source, variant = "link", className = "" }: { source: FeedbackSource; variant?: "link" | "icon"; className?: string }) {
	const t = useTranslations("feedback");
	const [open, setOpen] = useState(false);
	return (
		<>
			{variant === "icon" ? (
				<button
					type="button"
					onClick={() => setOpen(true)}
					title={t("open")}
					aria-label={t("open")}
					className={`p-2.5 rounded-xl text-muted-foreground hover:bg-secondary/60 hover:text-primary transition-colors ${className}`}
				>
					<Bug size={20} aria-hidden="true" />
				</button>
			) : (
				<button type="button" onClick={() => setOpen(true)} className={`underline-offset-2 hover:underline ${className}`}>
					{t("open")}
				</button>
			)}
			{open && <FeedbackDialog source={source} onClose={() => setOpen(false)} />}
		</>
	);
}
