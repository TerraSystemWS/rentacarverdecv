import { LucideIcon, ArrowUpRight, TrendingUp } from "lucide-react";

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
	trend?: string;
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
					{trend && (
						<p className="text-xs md:text-sm font-bold text-primary mt-3 flex items-center gap-1.5">
							<TrendingUp className="w-4 h-4" />
							{trend}
						</p>
					)}
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
