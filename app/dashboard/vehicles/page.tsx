"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Car as CarIcon } from "lucide-react";
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

	const handleDelete = async (id?: number) => {
		if (!id) return;
		if (!window.confirm("Tem a certeza que deseja eliminar este veículo?")) return;

		try {
			await apiFetch(endpoints.vehicles.delete(id), { method: "DELETE" });
			setRows((prev) => prev.filter((r) => r.id !== id));
		} catch (e: any) {
			alert(e.message || "Falha ao eliminar");
		}
	};

	const handleSave = async (vehicleData: Vehicle, images?: File[]) => {
		setIsSubmitting(true);
		try {
			const bodyData = new FormData();
			bodyData.append("vehicle", JSON.stringify(vehicleData));
			if (images && images.length > 0) {
				images.forEach((img) => {
					bodyData.append("images", img);
				});
			}

			if (selectedVehicle?.id) {
				// Update
				const updated = await apiFetch<Vehicle>(endpoints.vehicles.update(selectedVehicle.id), {
					method: "PUT",
					body: bodyData,
				});

				setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
			} else {
				// Create
				const created = await apiFetch<Vehicle>(endpoints.vehicles.create, {
					method: "POST",
					body: bodyData,
				});
				setRows((prev) => [created, ...prev]);
			}
			setIsDialogOpen(false);
		} catch (e: any) {
			console.error(e);
			alert("Falha ao guardar. " + (e.message || ""));
		} finally {
			setIsSubmitting(false);
		}
	};

	// Helper to get image source
	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `http://localhost:8090${url}`;
		}
		return url;
	};

	// View Model Mapper
	const viewRows = rows.map((vehicle) => ({
		...vehicle,
		preview: (
			<div className="flex items-center gap-4">
				<div className="h-16 w-24 flex-shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 relative shadow-inner">
					{vehicle.images && vehicle.images.length > 0 ? (
						<img
							src={getImageSrc(vehicle.images[0].url)}
							alt={vehicle.model}
							className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full items-center justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Sem Imagem</div>
					)}
				</div>
				<div>
					<div className="font-extrabold text-zinc-900 dark:text-zinc-50 text-base tracking-tight">
						{vehicle.make} {vehicle.model}
					</div>
					<div className="text-[10px] font-bold text-zinc-500 mt-0.5 uppercase tracking-wider">
						{vehicle.year} • {vehicle.licensePlate}
					</div>
				</div>
			</div>
		),
		details: (
			<div className="flex flex-col gap-0.5">
				<span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{vehicle.gearbox} • {vehicle.fuelType}</span>
				<span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{vehicle.classType}</span>
			</div>
		),
		licensePlate: (
			<span className="font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 uppercase tracking-widest tabular-nums">
				{vehicle.licensePlate}
			</span>
		),
		daily_rate: (
			<span className="text-zinc-900 dark:text-zinc-50 font-extrabold text-base tabular-nums tracking-tight">
				{vehicle.pricePerDay?.toLocaleString('pt-CV', { style: 'currency', currency: 'CVE' })}
			</span>
		),
		status: (
			<div className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border shadow-sm ${vehicle.available
				? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20"
				: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-500 dark:border-orange-500/20"
				}`}>
				<span className={`w-2 h-2 rounded-full ${vehicle.available ? "bg-emerald-500" : "bg-orange-500"}`}></span>
				{vehicle.available ? "Disponível" : "Indisponível"}
			</div>
		),
		actions: (
			<div className="flex items-center justify-end gap-2">
				<button
					onClick={() => openEditDialog(vehicle)}
					className="w-9 h-9 flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white transition-all shadow-sm !p-0"
					title="Editar"
				>
					<Pencil size={16} className="stroke-[2.5]" />
				</button>
				<button
					onClick={() => handleDelete(vehicle.id)}
					className="w-9 h-9 flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-destructive hover:text-white transition-all shadow-sm !p-0"
					title="Eliminar"
				>
					<Trash2 size={16} className="stroke-[2.5]" />
				</button>
			</div>
		),
	}));

	return (
		<div className="min-h-screen pb-20">
			<TopNav
				title="Frota de Veículos"
				subtitle="Gestão integral dos veículos disponíveis."
				right={
					<button
						onClick={openCreateDialog}
						className="btn-primary flex items-center gap-2 h-10 px-6"
					>
						<Plus size={18} className="stroke-[2.5]" />
						<span className="font-bold uppercase tracking-wider text-[10px]">Novo Veículo</span>
					</button>
				}
			/>

			<PageShell>
				<div className="max-w-7xl mx-auto">
					{loading && rows.length === 0 ? (
						<div className="flex flex-col items-center justify-center min-h-[400px] gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-500">
							<CarIcon className="w-12 h-12 text-zinc-100 dark:text-zinc-800 animate-pulse" />
							<span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sincronizando frota...</span>
						</div>
					) : err ? (
						<div className="border border-destructive/20 bg-destructive/5 p-10 text-center text-destructive shadow-sm">
							<p className="font-bold text-lg mb-4">{err}</p>
							<button onClick={fetchVehicles} className="btn-primary px-10">Tentar Novamente</button>
						</div>
					) : (
						<DataTable
							columns={[
								{ key: "preview", label: "Veículo" },
								{ key: "details", label: "Detalhes" },
								{ key: "licensePlate", label: "Matrícula" },
								{ key: "daily_rate", label: "Diária" },
								{ key: "status", label: "Estado" },
								{ key: "actions", label: "Ações" },
							]}
							rows={viewRows as any}
						/>
					)}
				</div>
			</PageShell>

			<VehicleDialog
				isOpen={isDialogOpen}
				title={selectedVehicle ? "Editar Veículo" : "Novidade na Frota"}
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
