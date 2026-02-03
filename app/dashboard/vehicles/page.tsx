"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import VehicleDialog from "./_components/vehicle-dialog";
import VehicleForm from "./_components/vehicle-form";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Vehicle } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

export default function VehiclesPage() {
	const [rows, setRows] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);

	// Dialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch Data
	const fetchVehicles = async () => {
		setLoading(true);
		setErr(null);
		try {
			// Using the public endpoint as per user hint on output usually coming from there or similar
			const data = await apiFetch<Vehicle[]>(endpoints.vehicles.list(100));
			setRows(data);
		} catch (e: any) {
			setErr(e?.message || "Erro ao carregar veículos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchVehicles();
	}, []);

	// Handlers
	const openCreateDialog = () => {
		setSelectedVehicle(undefined);
		setIsDialogOpen(true);
	};

	const openEditDialog = (vehicle: Vehicle) => {
		setSelectedVehicle(vehicle);
		setIsDialogOpen(true);
	};

	const handleDelete = async (id: number) => {
		if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

		try {
			await apiFetch(endpoints.vehicles.delete(id), { method: "DELETE" });
			setRows((prev) => prev.filter((r) => r.id !== id));
		} catch (e: any) {
			alert(e.message || "Failed to delete");
		}
	};

	const handleSave = async (data: Vehicle) => {
		setIsSubmitting(true);
		try {
			if (selectedVehicle?.id) {
				// Update
				const updated = await apiFetch<Vehicle>(endpoints.vehicles.update(selectedVehicle.id), {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});

				// Optimistic logic, or refresh
				setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
			} else {
				// Create
				const created = await apiFetch<Vehicle>(endpoints.vehicles.create, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				setRows((prev) => [created, ...prev]);
			}
			setIsDialogOpen(false);
		} catch (e: any) {
			// alert(e.message || "Failed to save vehicle");
			// In case backend mock doesn't truly return the object on create/update yet, we might need a fetchVehicles call.
			// But let's assume standard behavior.
			console.error(e);
			alert("Failed to save. " + (e.message || ""));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<TopNav
				title="Vehicles"
				subtitle="Manage your fleet"
				right={
					<button
						onClick={openCreateDialog}
						className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
					>
						<Plus size={18} /> New Vehicle
					</button>
				}
			/>

			<PageShell>
				{loading && rows.length === 0 ? (
					<div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm">
						<div className="flex flex-col items-center gap-2 text-gray-400">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
							<span className="text-sm font-medium">Loading fleet...</span>
						</div>
					</div>
				) : err ? (
					<div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600 shadow-sm">
						<p className="font-medium">{err}</p>
						<button onClick={fetchVehicles} className="mt-2 text-sm underline hover:text-red-700">Retry</button>
					</div>
				) : (
					<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
						<table className="w-full text-left text-sm text-gray-600">
							<thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
								<tr>
									<th className="px-6 py-4">Vehicle</th>
									<th className="px-6 py-4">Details</th>
									<th className="px-6 py-4">License Plate</th>
									<th className="px-6 py-4">Price / Day</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{rows.map((vehicle) => (
									<tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center gap-4">
												<div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100 relative group">
													{vehicle.imageUrl ? (
														<img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
													) : (
														<div className="flex h-full items-center justify-center text-xs text-gray-400">No img</div>
													)}
												</div>
												<div>
													<div className="font-bold text-gray-900 text-base">{vehicle.make} {vehicle.model}</div>
													<div className="text-xs text-gray-400 mt-0.5 font-medium">{vehicle.year}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-col gap-1">
												<span className="text-xs font-medium text-gray-500">Make: {vehicle.make}</span>
												<span className="text-xs font-medium text-gray-500">Model: {vehicle.model}</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="font-mono text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200">
												{vehicle.licensePlate}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="text-gray-900 font-bold">
												{vehicle.pricePerDay?.toLocaleString('pt-CV', { style: 'currency', currency: 'CVE' })}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${vehicle.available
													? "bg-green-50 text-green-700 border border-green-100"
													: "bg-orange-50 text-orange-700 border border-orange-100"
												}`}>
												<span className={`w-1.5 h-1.5 rounded-full ${vehicle.available ? "bg-green-500" : "bg-orange-500"}`}></span>
												{vehicle.available ? "Available" : "Unavailable"}
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => openEditDialog(vehicle)}
													className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
													title="Edit"
												>
													<Pencil size={18} />
												</button>
												<button
													onClick={() => handleDelete(vehicle.id)}
													className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
													title="Delete"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))}
								{rows.length === 0 && (
									<tr>
										<td colSpan={6} className="px-6 py-12 text-center text-gray-400">
											No vehicles found in your fleet.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</PageShell>

			<VehicleDialog
				isOpen={isDialogOpen}
				title={selectedVehicle ? "Edit Vehicle" : "New Vehicle"}
				onClose={() => setIsDialogOpen(false)}
			>
				<VehicleForm
					initialData={selectedVehicle}
					onSubmit={handleSave}
					onCancel={() => setIsDialogOpen(false)}
					isSubmitting={isSubmitting}
				/>
			</VehicleDialog>
		</div>
	);
}
