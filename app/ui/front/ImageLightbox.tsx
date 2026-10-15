"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { withWidth } from "@/lib/utils/media";

export type LightboxImage = { src: string; alt?: string; caption?: string; description?: string; meta?: string };

/**
 * Imagem em grande com lupa (galeria e viaturas):
 *  - setas (no ecrã e ← →) para a anterior e a seguinte, Esc para fechar;
 *  - clicar ou tocar duas vezes na imagem amplia; com a imagem ampliada, a
 *    zona aumentada segue o rato (ou o dedo); botões + e −;
 *  - no telemóvel, deslizar para os lados muda de imagem.
 */
export default function ImageLightbox({
	images,
	index,
	onClose,
	onIndexChange,
}: {
	images: LightboxImage[];
	index: number;
	onClose: () => void;
	onIndexChange: (i: number) => void;
}) {
	const t = useTranslations("lightbox");
	const [zoom, setZoom] = useState(1);
	const [origin, setOrigin] = useState({ x: 50, y: 50 });
	const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
	const lastTap = useRef(0);
	const total = images.length;
	const img = images[index];

	const go = useCallback(
		(delta: number) => {
			if (total < 2) return;
			setZoom(1);
			onIndexChange((index + delta + total) % total);
		},
		[index, total, onIndexChange],
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			else if (e.key === "ArrowRight") go(1);
			else if (e.key === "ArrowLeft") go(-1);
			else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(4, z + 0.5));
			else if (e.key === "-") setZoom((z) => Math.max(1, z - 0.5));
		};
		window.addEventListener("keydown", onKey);
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = overflow;
		};
	}, [go, onClose]);

	// Pré-carrega as vizinhas para as setas serem imediatas.
	useEffect(() => {
		[index + 1, index - 1].forEach((i) => {
			const n = images[(i + total) % total];
			if (n) new Image().src = withWidth(n.src, 1920);
		});
	}, [index, images, total]);

	const moveOrigin = (clientX: number, clientY: number, el: HTMLElement) => {
		const r = el.getBoundingClientRect();
		setOrigin({
			x: Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)),
			y: Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100)),
		});
	};

	const toggleZoom = (clientX: number, clientY: number, el: HTMLElement) => {
		moveOrigin(clientX, clientY, el);
		setZoom((z) => (z > 1 ? 1 : 2.5));
	};

	if (!img || typeof document === "undefined") return null;

	const btn = "flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors backdrop-blur";
	// O CSS do template põe "padding: 12px 30px" em todos os <button>: sem isto os
	// ícones e as miniaturas ficam com 0 px (pareciam não existir).
	const reset: React.CSSProperties = { padding: 0, margin: 0, minWidth: 0, lineHeight: 1, textTransform: "none", letterSpacing: "normal" };

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-label={img.alt || img.caption || t("open")}
			className="fixed inset-0 z-[1000] flex flex-col bg-black/95"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			{/* Barra de cima: contador, lupa e fechar */}
			<div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
				<span className="text-sm font-semibold tabular-nums" aria-live="polite">
					{total > 1 ? t("counter", { current: index + 1, total }) : ""}
				</span>
				<div className="flex items-center gap-2">
					<button type="button" style={reset} className={`${btn} h-10 w-10`} onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom <= 1} aria-label={t("zoomOut")}>
						<ZoomOut size={20} className="shrink-0" />
					</button>
					<button type="button" style={reset} className={`${btn} h-10 w-10`} onClick={() => setZoom((z) => Math.min(4, z + 0.5))} disabled={zoom >= 4} aria-label={t("zoomIn")}>
						<ZoomIn size={20} className="shrink-0" />
					</button>
					<button type="button" style={reset} className={`${btn} h-10 w-10`} onClick={onClose} aria-label={t("close")}>
						<X size={22} className="shrink-0" />
					</button>
				</div>
			</div>

			{/* Imagem */}
			<div
				className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-16"
				onClick={(e) => e.target === e.currentTarget && onClose()}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					key={img.src}
					src={withWidth(img.src, 1920)}
					alt={img.alt ?? ""}
					draggable={false}
					className={`max-h-full max-w-full select-none object-contain transition-transform duration-200 ${zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
					style={{ transform: `scale(${zoom})`, transformOrigin: `${origin.x}% ${origin.y}%` }}
					onClick={(e) => toggleZoom(e.clientX, e.clientY, e.currentTarget)}
					onMouseMove={(e) => zoom > 1 && moveOrigin(e.clientX, e.clientY, e.currentTarget)}
					onTouchStart={(e) => {
						const p = e.touches[0];
						touchStart.current = { x: p.clientX, y: p.clientY, t: Date.now() };
						// Toque duplo amplia/reduz.
						if (Date.now() - lastTap.current < 300) toggleZoom(p.clientX, p.clientY, e.currentTarget);
						lastTap.current = Date.now();
					}}
					onTouchMove={(e) => {
						const p = e.touches[0];
						if (zoom > 1) moveOrigin(p.clientX, p.clientY, e.currentTarget);
					}}
					onTouchEnd={(e) => {
						const s = touchStart.current;
						const p = e.changedTouches[0];
						touchStart.current = null;
						if (!s || zoom > 1) return;
						const dx = p.clientX - s.x;
						if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(p.clientY - s.y) && Date.now() - s.t < 600) go(dx < 0 ? 1 : -1);
					}}
				/>

				{total > 1 && (
					<>
						<button type="button" style={reset} className={`${btn} absolute left-2 sm:left-4 top-1/2 h-12 w-12 -translate-y-1/2`} onClick={() => go(-1)} aria-label={t("previous")}>
							<ChevronLeft size={28} className="shrink-0" />
						</button>
						<button type="button" style={reset} className={`${btn} absolute right-2 sm:right-4 top-1/2 h-12 w-12 -translate-y-1/2`} onClick={() => go(1)} aria-label={t("next")}>
							<ChevronRight size={28} className="shrink-0" />
						</button>
					</>
				)}
			</div>

			{/* Legenda e miniaturas */}
			<div className="px-4 pb-4 pt-2 text-center text-white">
				{img.caption && <p className="m-0 mb-1 text-sm font-semibold">{img.caption}</p>}
				{img.meta && <p className="m-0 mb-1 text-xs text-white/70">{img.meta}</p>}
				{/* Descrição completa (no cartão da página inicial só aparece o início). */}
				{img.description && (
					<div className="mx-auto mb-2 max-h-28 max-w-2xl overflow-y-auto text-left text-sm leading-relaxed text-white/85 whitespace-pre-line">
						{img.description}
					</div>
				)}
				{zoom === 1 && <p className="m-0 mb-2 text-xs text-white/60">{t("zoomHint")}</p>}
				{total > 1 && (
					<div className="mx-auto flex max-w-full justify-center gap-2 overflow-x-auto pb-1">
						{images.map((im, i) => (
							<button
								key={im.src + i}
								type="button"
								style={reset}
								onClick={() => { setZoom(1); onIndexChange(i); }}
								aria-label={im.alt || t("counter", { current: i + 1, total })}
								aria-current={i === index}
								className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 ${i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={withWidth(im.src, 320)} alt="" className="h-full w-full object-cover" loading="lazy" />
							</button>
						))}
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
