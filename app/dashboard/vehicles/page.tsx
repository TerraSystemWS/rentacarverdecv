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

				// Optimistic update or refresh
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
			alert(e.message || "Failed to save vehicle");
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
						className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
					>
						<Plus size={16} /> New Vehicle
					</button>
				}
			/>

			<PageShell>
				{loading && rows.length === 0 ? (
					<div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
						Loading fleet...
					</div>
				) : err ? (
					<div className="rounded-xl border bg-white p-4 text-sm text-red-600">
						{err}
					</div>
				) : (
					<DataTable
						columns={[
							{ key: "id", label: "ID" },
							{
								key: "image",
								label: "Image",
								render: (v) => (
									<div className="h-10 w-16 overflow-hidden rounded bg-gray-100 border">
										{v.images && v.images.length > 0 ? (
											<img src={v.images[0].url} alt="" className="h-full w-full object-cover" />
										) : (
											<div className="flex h-full items-center justify-center text-xs text-gray-400">No img</div>
										)}
									</div>
								)
							},
							{ key: "title", label: "Title", render: (v) => <span className="font-medium text-gray-900">{v.title}</span> },
							{
								key: "price",
								label: "Price",
								render: (v) => (
									<span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
										{v.rent_per_day} {v.rent_currency}/day
									</span>
								)
							},
							{
								key: "created_at",
								label: "Created",
								render: (v) => v.created_at ? fmtDateTime(v.created_at) : "—"
							},
							{
								key: "actions",
								label: "Actions",
								render: (v) => (
									<div className="flex items-center gap-2">
										<button
											onClick={() => openEditDialog(v)}
											className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
											title="Edit"
										>
											<Pencil size={16} />
										</button>
										<button
											onClick={() => v.id && handleDelete(v.id)}
											className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
											title="Delete"
										>
											<Trash2 size={16} />
										</button>
									</div>
								),
							},
						]}
						rows={rows}
						emptyText="No vehicles found. Add one to get started."
					/>
				)}
			</PageShell>

			<VehicleDialog
				isOpen={isDialogOpen}
				title={selectedVehicle ? `Edit ${selectedVehicle.title}` : "New Vehicle"}
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
