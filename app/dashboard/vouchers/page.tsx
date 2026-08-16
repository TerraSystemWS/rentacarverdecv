"use client";

import { useEffect, useState } from "react";
import { Ticket, Plus, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { Voucher, Vehicle } from "@/lib/api/types";

const emptyForm: {
	code: string; discountPercent: number; scope: Voucher["scope"]; vehicleId: number | undefined;
	classType: string; active: boolean; maxUses: number | undefined; maxUsesPerCustomer: number | undefined;
	validFrom: string; validUntil: string;
} = {
	code: "",
	discountPercent: 10,
	scope: "ALL",
	vehicleId: undefined,
	classType: "",
	active: true,
	maxUses: undefined,
	maxUsesPerCustomer: undefined,
	validFrom: "",
	validUntil: "",
};

export default function VouchersPage() {
	const [vouchers, setVouchers] = useState<Voucher[]>([]);
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState(emptyForm);

	async function load() {
		setLoading(true);
		try {
			const [v, cars] = await Promise.all([
				apiFetch<Voucher[]>(endpoints.vouchers.list),
				apiFetch<Vehicle[]>(endpoints.vehicles.dashboardList),
			]);
			setVouchers(v);
			setVehicles(cars);
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao carregar vouchers.", confirmButtonColor: "#3085d6" });
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	const handleDelete = async (id: number) => {
		const result = await Swal.fire({
			title: "Tem a certeza?",
			text: "Deseja mesmo eliminar este voucher?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sim, eliminar!",
			cancelButtonText: "Cancelar",
		});
		if (!result.isConfirmed) return;
		try {
			await apiFetch(endpoints.vouchers.delete(id), { method: "DELETE" });
			setVouchers((prev) => prev.filter((v) => v.id !== id));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao eliminar voucher.", confirmButtonColor: "#3085d6" });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const payload = {
				code: form.code,
				discountPercent: Number(form.discountPercent),
				scope: form.scope,
				vehicleId: form.scope === "VEHICLE" ? form.vehicleId : null,
				classType: form.scope === "CLASS" ? form.classType : null,
				active: form.active,
				maxUses: form.maxUses ? Number(form.maxUses) : null,
				maxUsesPerCustomer: form.maxUsesPerCustomer ? Number(form.maxUsesPerCustomer) : null,
				validFrom: form.validFrom ? new Date(form.validFrom).toISOString() : null,
				validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : null,
			};
			const created = await apiFetch<Voucher>(endpoints.vouchers.create, {
				method: "POST",
				body: JSON.stringify(payload),
			});
			setVouchers((prev) => [created, ...prev]);
			setIsDialogOpen(false);
			setForm(emptyForm);
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao criar voucher.", confirmButtonColor: "#3085d6" });
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div>
				<TopNav title="Vouchers" subtitle="Códigos de desconto" />
				<PageShell>
					<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
						<Ticket className="w-10 h-10 text-primary animate-pulse" />
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Vouchers...</p>
					</div>
				</PageShell>
			</div>
		);
	}

	return (
		<div>
			<TopNav
				title="Vouchers"
				subtitle="Códigos de desconto para reservas"
				right={
					<button
						onClick={() => setIsDialogOpen(true)}
						className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
					>
						<Plus size={16} />
						<span>Novo Voucher</span>
					</button>
				}
			/>
			<PageShell>
				<div className="max-w-7xl mx-auto space-y-10">
					<DataTable
						columns={[
							{ key: "code", label: "Código" },
							{ key: "discountPercent", label: "Desconto", render: (row: Voucher) => `${row.discountPercent}%` },
							{
								key: "scope",
								label: "Âmbito",
								render: (row: Voucher) =>
									row.scope === "VEHICLE" ? `Viatura: ${row.vehicleTitle ?? "—"}` : row.scope === "CLASS" ? `Classe: ${row.classType}` : "Toda a frota",
							},
							{
								key: "usedCount",
								label: "Utilizações",
								render: (row: Voucher) => `${row.usedCount ?? 0}${row.maxUses ? ` / ${row.maxUses}` : ""}`,
							},
							{
								key: "validity",
								label: "Validade",
								render: (row: Voucher) => (
									<span className="text-xs text-zinc-500">
										{row.validFrom || row.validUntil
											? `${row.validFrom ? new Date(row.validFrom).toLocaleDateString("pt-PT") : "—"} a ${row.validUntil ? new Date(row.validUntil).toLocaleDateString("pt-PT") : "—"}`
											: "Sem limite"}
										{row.maxUsesPerCustomer ? ` · máx. ${row.maxUsesPerCustomer}/cliente` : ""}
									</span>
								),
							},
							{
								key: "active",
								label: "Estado",
								render: (row: Voucher) => (
									<span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${row.usable ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"}`}>
										{row.usable ? "Utilizável" : "Indisponível"}
									</span>
								),
							},
							{
								key: "actions",
								label: "Ações",
								render: (row: Voucher) => (
									<div className="flex justify-end gap-2">
										<button
											onClick={() => handleDelete(row.id!)}
											className="p-2 hover:bg-red-50 rounded-lg text-zinc-500 hover:text-red-600 transition-colors"
											title="Eliminar"
										>
											<Trash2 size={18} />
										</button>
									</div>
								),
							},
						]}
						rows={vouchers as any}
					/>
				</div>
			</PageShell>

			{isDialogOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
					<div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 relative">
						<button onClick={() => setIsDialogOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700">
							<X size={20} />
						</button>
						<h3 className="text-lg font-black mb-6">Novo Voucher</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="text-xs font-bold uppercase text-zinc-500">Código</label>
								<input
									className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
									value={form.code}
									onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
									required
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-zinc-500">Desconto (%)</label>
								<input
									type="number"
									min={1}
									max={99}
									className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
									value={form.discountPercent}
									onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
									required
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-zinc-500">Âmbito</label>
								<select
									className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
									value={form.scope}
									onChange={(e) => setForm({ ...form, scope: e.target.value as any })}
								>
									<option value="ALL">Toda a frota</option>
									<option value="VEHICLE">Viatura específica</option>
									<option value="CLASS">Classe de viatura</option>
								</select>
							</div>
							{form.scope === "VEHICLE" && (
								<div>
									<label className="text-xs font-bold uppercase text-zinc-500">Viatura</label>
									<select
										className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
										value={form.vehicleId ?? ""}
										onChange={(e) => setForm({ ...form, vehicleId: Number(e.target.value) })}
										required
									>
										<option value="" disabled>Escolhe uma viatura</option>
										{vehicles.map((v) => (
											<option key={v.id} value={v.id}>{v.make} {v.model}</option>
										))}
									</select>
								</div>
							)}
							{form.scope === "CLASS" && (
								<div>
									<label className="text-xs font-bold uppercase text-zinc-500">Classe</label>
									<input
										className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
										value={form.classType}
										onChange={(e) => setForm({ ...form, classType: e.target.value })}
										required
									/>
								</div>
							)}
							<div>
								<label className="text-xs font-bold uppercase text-zinc-500">Nº máximo de utilizações (total, opcional)</label>
								<input
									type="number"
									min={1}
									className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
									value={form.maxUses ?? ""}
									onChange={(e) => setForm({ ...form, maxUses: e.target.value ? Number(e.target.value) : undefined })}
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-zinc-500">Nº máximo por cliente (opcional)</label>
								<input
									type="number"
									min={1}
									className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
									value={form.maxUsesPerCustomer ?? ""}
									onChange={(e) => setForm({ ...form, maxUsesPerCustomer: e.target.value ? Number(e.target.value) : undefined })}
								/>
								<p className="text-[10px] text-zinc-400 mt-1">Evita que um só cliente esgote sozinho o voucher.</p>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="text-xs font-bold uppercase text-zinc-500">Válido a partir de</label>
									<input
										type="date"
										className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
										value={form.validFrom}
										onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
									/>
								</div>
								<div>
									<label className="text-xs font-bold uppercase text-zinc-500">Válido até</label>
									<input
										type="date"
										className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
										value={form.validUntil}
										onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
									/>
								</div>
							</div>
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all"
							>
								{isSubmitting ? "A guardar..." : "Criar Voucher"}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
