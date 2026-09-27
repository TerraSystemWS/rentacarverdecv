"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LOCALE_COOKIE, locales, localeNames, type Locale } from "@/i18n/config";

// Seletor PT / EN / FR no topo do site. Guarda a escolha num cookie (1 ano) e
// volta a renderizar a página na nova língua — o URL não muda.
export default function LanguageSwitcher() {
	const current = useLocale();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function choose(locale: Locale) {
		if (locale === current) return;
		document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
		startTransition(() => router.refresh());
	}

	return (
		<div className="lang-switcher" role="group" aria-label="Idioma / Language / Langue" aria-busy={isPending}>
			{locales.map((l) => (
				<button
					key={l}
					type="button"
					lang={l}
					title={localeNames[l]}
					aria-pressed={l === current}
					className={l === current ? "is-active" : undefined}
					onClick={() => choose(l)}
				>
					{l.toUpperCase()}
				</button>
			))}
		</div>
	);
}
