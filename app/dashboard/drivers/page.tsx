"use client";

import { useEffect, useState } from "react";
import { UserSquare2, Plus, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import DriverDialog from "./_components/driver-dialog";
import DriverForm from "./_components/driver-form";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Driver } from "@/lib/api/types";

export default function DriversPage() {
    const { authFetch } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

    async function fetchDrivers() {
        setLoading(true);
        setErr(null);
        try {
            const res = await authFetch(endpoints.drivers.list);
            if (!res.ok) throw new Error("Erro ao carregar motoristas.");
            const data = await res.json();
            setDrivers(data);
        } catch (e: any) {
            setErr(e?.message || "Erro ao carregar motoristas.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleOpenCreate = () => {
        setEditingDriver(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (driver: Driver) => {
        setEditingDriver(driver);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Tem a certeza?",
            text: "Deseja mesmo eliminar este motorista?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, eliminar!",
            cancelButtonText: "Cancelar"
        });
        if (!result.isConfirmed) return;

        try {
            const res = await authFetch(`/dashboard/drivers/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao eliminar motorista.");
            setDrivers(prev => prev.filter(p => p.id !== id));
        } catch (e: any) {
            Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao eliminar motorista.", confirmButtonColor: "#3085d6" });
        }
    };

    const handleSubmit = async (data: Driver, image?: File) => {
        setIsSubmitting(true);
        try {
            const isEdit = !!editingDriver;
            const url = isEdit ? `/dashboard/drivers/${editingDriver.id}` : "/dashboard/drivers";
            const method = isEdit ? "PUT" : "POST";

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);

            if (image) {
                formData.append("image", image);
            }

            const res = await authFetch(url, {
                method,
                body: formData,
            });

            if (!res.ok) throw new Error("Erro ao guardar motorista.");
            const result = await res.json();

            if (isEdit) {
                setDrivers(prev => prev.map(p => p.id === result.id ? result : p));
            } else {
                setDrivers(prev => [result, ...prev]);
            }

            setIsDialogOpen(false);
        } catch (e: any) {
            Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao guardar motorista.", confirmButtonColor: "#3085d6" });
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
                <TopNav title="Motoristas" subtitle="Gestão de motoristas" />
                <PageShell>
                    <div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <UserSquare2 className="w-10 h-10 text-primary animate-pulse" />
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Motoristas...</p>
                    </div>
                </PageShell>
            </div>
        );
    }

    return (
        <div>
            <TopNav
                title="Motoristas"
                subtitle="Gestão de motoristas"
                right={
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus size={16} />
                        <span>Novo Motorista</span>
                    </button>
                }
            />

            <PageShell>
                <div className="max-w-7xl mx-auto">
                    <DataTable
                        columns={[
                            {
                                key: "imageUrl",
                                label: "Foto",
                                render: (row: Driver) => (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                                        {row.imageUrl ? (
                                            <img src={getImageSrc(row.imageUrl)} alt={row.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <img
                                                src="/assets/images/driver/avatar-placeholder.png"
                                                alt="Default"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                )
                            },
                            { key: "name", label: "Nome" },
                            {
                                key: "description",
                                label: "Descrição",
                                render: (row: Driver) => <span className="text-zinc-500 truncate max-w-[300px] inline-block">{row.description}</span>
                            },
                            {
                                key: "actions",
                                label: "Ações",
                                render: (row: Driver) => (
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
                        rows={drivers}
                    />
                </div>
            </PageShell>

            <DriverDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingDriver ? "Editar Motorista" : "Novo Motorista"}
            >
                <DriverForm
                    initialData={editingDriver || undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </DriverDialog>
        </div>
    );
}
