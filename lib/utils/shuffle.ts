/** Cópia da lista em ordem aleatória (Fisher–Yates). Usada para os destinos mudarem a cada visita. */
export function shuffle<T>(list: T[]): T[] {
	const a = [...list];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
