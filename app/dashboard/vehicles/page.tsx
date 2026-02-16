"use client";

import { useEffect, useState } from "react";
import { Car, Plus, Pencil, Trash2 } from "lucide-react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import VehicleDialog from "./_components/vehicle-dialog";
import VehicleForm from "./_components/vehicle-form";
import { apiFetch } from "@/lib/api/client";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Vehicle } from "@/lib/api/types";

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    async function fetchVehicles() {
        setLoading(true);
        setErr(null);
        try {
            const data = await apiFetch<Vehicle[]>(endpoints.vehicles.list(100));
            setVehicles(data);
        } catch (e: any) {
            setErr(e?.message || "Erro ao carregar veículos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleOpenCreate = () => {
        setEditingVehicle(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem a certeza que deseja eliminar este veículo?")) return;

        try {
            await apiFetch(endpoints.vehicles.delete(id), {
                method: "DELETE",
            });
            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch (e: any) {
            alert(e?.message || "Erro ao eliminar veículo.");
        }
    };

    const handleSubmit = async (data: Vehicle, images?: File[]) => {
        setIsSubmitting(true);
        try {
            const isEdit = !!editingVehicle;
            const url = isEdit ? endpoints.vehicles.update(editingVehicle.id!) : endpoints.vehicles.create;
            const method = isEdit ? "PUT" : "POST";

            // We need to use FormData for images
            const formData = new FormData();

            // Remove images from the main data object to send separately if needed, 
            // though here we are just sending the whole object as JSON string in a field
            // or building the form data.
            // Let's check how the backend expects it. Usually it's better to send fields.

            // Simple approach: send JSON for data and files for images
            formData.append("vehicle", new Blob([JSON.stringify(data)], { type: "application/json" }));

            if (images && images.length > 0) {
                images.forEach((image) => {
                    formData.append("files", image);
                });
            }

            const result = await apiFetch<Vehicle>(url, {
                method,
                body: formData,
            });

            if (isEdit) {
                setVehicles(prev => prev.map(v => v.id === result.id ? result : v));
            } else {
                setVehicles(prev => [result, ...prev]);
            }

            setIsDialogOpen(false);
        } catch (e: any) {
            console.error("Error submitting vehicle:", e);
            alert(e?.message || "Erro ao guardar veículo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getImageSrc = (url: string) => {
        if (!url) return "";
        if (url.startsWith('/uploads')) {
            return `${API_BASE_URL}${url}`;
        }
        return url;
    };

    if (loading) {
        return (
            <div>
                <TopNav title="Veículos" subtitle="Gestão da frota" />
                <PageShell>
                    <div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <Car className="w-10 h-10 text-primary animate-pulse" />
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Veículos...</p>
                    </div>
                </PageShell>
            </div>
        );
    }

    return (
        <div>
            <TopNav
                title="Veículos"
                subtitle="Gestão da frota"
                right={
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus size={16} />
                        <span>Novo Veículo</span>
                    </button>
                }
            />

            <PageShell>
                <div className="max-w-7xl mx-auto">
                    <DataTable
                        columns={[
                            {
                                key: "images",
                                label: "Imagem",
                                render: (row: Vehicle) => {
                                    const firstImg = row.images?.[0]?.url;
                                    return (
                                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm relative group cursor-zoom-in">
                                            {firstImg ? (
                                                <img
                                                    src={getImageSrc(firstImg)}
                                                    alt=""
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Car className="w-4 h-4 text-zinc-300" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            },
                            { key: "make", label: "Marca" },
                            { key: "model", label: "Modelo" },
                            { key: "year", label: "Ano" },
                            { key: "licensePlate", label: "Matrícula" },
                            {
                                key: "pricePerDay",
                                label: "Preço/Dia",
                                render: (row: Vehicle) => (
                                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                                        {row.pricePerDay?.toLocaleString('pt-CV', { style: 'currency', currency: 'CVE' })}
                                    </span>
                                )
                            },
                            {
                                key: "actions",
                                label: "Ações",
                                render: (row: Vehicle) => (
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(row)}
                                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-primary transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(row.id!)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-zinc-500 hover:text-red-600 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        rows={vehicles.map(v => ({
                            ...v,
                            // Pre-render some simple things if needed, or use the render function in DataTable
                            // DataTable currently just does row[col.key], so we should use render or maps
                        }))}
                    />
                </div>
            </PageShell>

            <VehicleDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingVehicle ? "Editar Veículo" : "Novo Veículo"}
            >
                <VehicleForm
                    initialData={editingVehicle || undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </VehicleDialog>
        </div>
    );
}
