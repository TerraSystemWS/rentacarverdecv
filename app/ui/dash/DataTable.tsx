// components/dashboard/DataTable.tsx
export type Column<T> = {
	key: string;
	label: string;
	render?: (row: T) => React.ReactNode;
};

export default function DataTable<T extends Record<string, any>>({
	columns,
	rows,
	emptyText = "Sem dados encontrados.",
}: {
	columns: Column<T>[];
	rows: T[];
	emptyText?: string;
}) {
	return (
		<div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm shadow-zinc-200/50">
			<div className="overflow-x-auto custom-scrollbar">
				<table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
					<thead>
						<tr className="bg-zinc-50/50 dark:bg-zinc-800/50">
							{columns.map((col) => (
								<th
									key={col.key as string}
									className="px-4 md:px-6 py-4 md:py-5 text-left text-xs md:text-sm font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800"
								>
									{col.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
						{rows.map((row, idx) => (
							<tr
								key={idx}
								className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
							>
								{columns.map((col) => (
									<td
										key={col.key as string}
										className="px-4 md:px-6 py-5 md:py-6 text-sm md:text-base font-semibold text-zinc-600 dark:text-zinc-300"
									>
										{col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
