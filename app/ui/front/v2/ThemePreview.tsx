"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import { themeCss } from "@/lib/theme/tokens";

// Pré-visualizar um tema antes de o ativar: o dashboard abre o site com
// ?tema=<id>. Só muda as cores nesse separador; o site continua com o tema
// ativo para toda a gente.
function Preview() {
	const params = useSearchParams();
	const id = Number(params.get("tema"));
	const [state, setState] = useState<{ css: string; name: string } | null>(null);

	useEffect(() => {
		if (!id) return;
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.themes.preview(id)}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((theme) => {
				if (!cancelled && theme) setState({ css: themeCss(theme.colors, "html body .site-v2"), name: String(theme.name ?? "") });
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [id]);

	if (!id || !state) return null;
	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: state.css }} />
			<div className="v2-theme-preview" role="status">
				Pré-visualização do tema «{state.name}»
			</div>
		</>
	);
}

export default function ThemePreview() {
	return (
		<Suspense fallback={null}>
			<Preview />
		</Suspense>
	);
}
