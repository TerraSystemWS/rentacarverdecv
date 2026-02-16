"use client";

import { useEffect, useState } from "react";
import { Handshake, Plus, Pencil, Trash2, Globe } from "lucide-react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import PartnerDialog from "./_components/partner-dialog";
import PartnerForm from "./_components/partner-form";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Partner } from "@/lib/api/types";

export default function PartnersPage() {
    const { authFetch } = useAuth();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

    async function fetchPartners() {
        setLoading(true);
        setErr(null);
        try {
            const res = await authFetch(endpoints.partners.list);
            if (!res.ok) throw new Error("Erro ao carregar parceiros.");
            const data = await res.json();
            setPartners(data);
        } catch (e: any) {
            setErr(e?.message || "Erro ao carregar parceiros.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleOpenCreate = () => {
        setEditingPartner(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem a certeza que deseja eliminar este parceiro?")) return;

        try {
            const res = await authFetch(`/dashboard/partners/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao eliminar parceiro.");
            setPartners(prev => prev.filter(p => p.id !== id));
        } catch (e: any) {
            alert(e?.message || "Erro ao eliminar parceiro.");
        }
    };

    const handleSubmit = async (data: Partner, logo?: File) => {
        setIsSubmitting(true);
        try {
            const isEdit = !!editingPartner;
            const url = isEdit ? `/dashboard/partners/${editingPartner.id}` : "/dashboard/partners";
            const method = isEdit ? "PUT" : "POST";

            const formData = new FormData();
            formData.append("partner", new Blob([JSON.stringify(data)], { type: "application/json" }));

            if (logo) {
                formData.append("file", logo);
            }

            const res = await authFetch(url, {
                method,
                body: formData,
            });

            if (!res.ok) throw new Error("Erro ao guardar parceiro.");
            const result = await res.json();

            if (isEdit) {
                setPartners(prev => prev.map(p => p.id === result.id ? result : p));
            } else {
                setPartners(prev => [result, ...prev]);
            }

            setIsDialogOpen(false);
        } catch (e: any) {
            alert(e?.message || "Erro ao guardar parceiro.");
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
                <TopNav title="Parceiros" subtitle="Gestão de colaborações" />
                <PageShell>
                    <div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <Handshake className="w-10 h-10 text-primary animate-pulse" />
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Parceiros...</p>
                    </div>
                </PageShell>
            </div>
        );
    }

    return (
        <div>
            <TopNav
                title="Parceiros"
                subtitle="Gestão de colaborações"
                right={
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus size={16} />
                        <span>Novo Parceiro</span>
                    </button>
                }
            />

            <PageShell>
                <div className="max-w-7xl mx-auto">
                    <DataTable
                        columns={[
                            {
                                key: "logoUrl",
                                label: "Logo",
                                render: (row: Partner) => (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-200 flex items-center justify-center p-2">
                                        {row.logoUrl ? (
                                            <img src={getImageSrc(row.logoUrl)} alt="" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <Handshake className="w-5 h-5 text-zinc-300" />
                                        )}
                                    </div>
                                )
                            },
                            { key: "name", label: "Nome" },
                            {
                                key: "websiteUrl",
                                label: "Website",
                                render: (row: Partner) => row.websiteUrl ? (
                                    <a href={row.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                        <Globe size={14} />
                                        <span className="max-w-[200px] truncate">{row.websiteUrl}</span>
                                    </a>
                                ) : <span className="text-zinc-400">-</span>
                            },
                            {
                                key: "actions",
                                label: "Ações",
                                render: (row: Partner) => (
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
                        rows={partners}
                    />
                </div>
            </PageShell>

            <PartnerDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingPartner ? "Editar Parceiro" : "Novo Parceiro"}
            >
                <PartnerForm
                    initialData={editingPartner || undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </PartnerDialog>
        </div>
    );
}
