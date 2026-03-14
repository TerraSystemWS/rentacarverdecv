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
		<div className="card-solid p-4 md:p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
			<div className="absolute top-0 left-0 w-1 h-full bg-primary" />

			<div className="flex items-start justify-between relative z-10 gap-2">
				<div className="min-w-0">
					<p className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 truncate">{label}</p>
					<h3 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight truncate">
						{value}
					</h3>
					{trend && (
						<p className="text-[10px] md:text-xs font-bold text-primary mt-2 flex items-center gap-1">
							<TrendingUp className="w-3 h-3" />
							{trend}
						</p>
					)}
					{hint && (
						<p className="text-[10px] md:text-xs font-medium text-zinc-400 mt-1 italic truncate">{hint}</p>
					)}
				</div>
				<div className="shrink-0 p-2.5 md:p-3 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shadow-inner group-hover:scale-110 transition-transform duration-300">
					<Icon className="w-5 h-5 md:w-6 md:h-6" />
				</div>
			</div>
		</div>
	);
}
