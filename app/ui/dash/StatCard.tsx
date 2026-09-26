import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

export type Trend = { text: string; direction: "up" | "down" | "flat"; detail: string };

/**
 * Tendência dos últimos 30 dias face aos 30 anteriores.
 * Sem base de comparação (anterior = 0) a percentagem não faz sentido:
 * mostra o número absoluto ("+3 novos em 30 dias").
 */
export function computeTrend(current: number, previous: number, noun: string): Trend {
	const detail = `${current} ${noun} nos últimos 30 dias (${previous} nos 30 dias antes)`;
	if (previous === 0) {
		return current === 0
			? { text: `Sem ${noun} em 30 dias`, direction: "flat", detail }
			: { text: `+${current} ${noun} em 30 dias`, direction: "up", detail };
	}
	const pct = Math.round(((current - previous) / previous) * 100);
	if (pct === 0) return { text: "Igual aos 30 dias antes", direction: "flat", detail };
	return {
		text: `${pct > 0 ? "+" : ""}${pct}% vs. 30 dias antes`,
		direction: pct > 0 ? "up" : "down",
		detail,
	};
}

const TREND_STYLE = {
	up: { Icon: TrendingUp, cls: "text-primary" },
	down: { Icon: TrendingDown, cls: "text-red-600" },
	flat: { Icon: Minus, cls: "text-zinc-400" },
} as const;

export default function StatCard({
	label,
	value,
	hint,
	icon: Icon,
	trend,
}: {
	label: string;
	value: string | number;
	hint?: string;
	icon: LucideIcon;
	trend?: Trend;
}) {
	return (
		<div className="card-solid p-5 md:p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
			<div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />

			<div className="flex items-start justify-between relative z-10 gap-3">
				<div className="min-w-0">
					<p className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1.5 truncate">{label}</p>
					<h3 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter truncate">
						{value}
					</h3>
					{trend && (() => {
						const { Icon: TrendIcon, cls } = TREND_STYLE[trend.direction];
						return (
							<p className={`text-xs md:text-sm font-bold mt-3 flex items-center gap-1.5 ${cls}`} title={trend.detail}>
								<TrendIcon className="w-4 h-4 shrink-0" />
								<span className="truncate">{trend.text}</span>
							</p>
						);
					})()}
					{hint && (
						<p className="text-xs md:text-sm font-semibold text-zinc-400 mt-1.5 italic truncate">{hint}</p>
					)}
				</div>
				<div className="shrink-0 p-3 md:p-4 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary shadow-inner group-hover:scale-110 transition-transform duration-300">
					<Icon className="w-6 h-6 md:w-7 md:h-7" />
				</div>
			</div>
		</div>
	);
}
