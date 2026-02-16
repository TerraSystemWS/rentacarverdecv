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
		<div className="overflow-hidden card-solid shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
						<tr>
							{columns.map((col) => (
								<th
									key={col.key as string}
									className={`px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest ${col.key === "actions" ? "text-right" : "text-left"}`}
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
								className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-150"
							>
								{columns.map((col) => (
									<td
										key={col.key as string}
										className={`px-6 py-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 ${col.key === "actions" ? "text-right" : "text-left"}`}
									>
										{row[col.key] as React.ReactNode}
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
