// components/dashboard/DataTable.tsx
export default function DataTable<T extends Record<string, any>>({
	columns,
	rows,
	emptyText = "Sem dados.",
}: {
	columns: { key: keyof T; label: string }[];
	rows: T[];
	emptyText?: string;
}) {
	return (
		<div className="overflow-x-auto rounded-xl border bg-white">
			<table className="w-full text-sm">
				<thead className="border-b bg-gray-50">
					<tr>
						{columns.map((c) => (
							<th
								key={String(c.key)}
								className="px-4 py-3 text-left font-medium"
							>
								{c.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.length === 0 ? (
						<tr>
							<td className="px-4 py-4 text-gray-500" colSpan={columns.length}>
								{emptyText}
							</td>
						</tr>
					) : (
						rows.map((r, idx) => (
							<tr key={idx} className="border-b last:border-b-0">
								{columns.map((c) => (
									<td key={String(c.key)} className="px-4 py-3">
										{String(r[c.key] ?? "")}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
