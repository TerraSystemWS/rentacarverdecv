"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPinned, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import PartnerDialog from "../partners/_components/partner-dialog";
import PlaceForm, { type PlaceFormData } from "./_components/place-form";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints } from "@/lib/api/endpoints";
import type { DestinationPlace } from "@/lib/api/types";

// Conteúdo → Destinos: lista de locais (Tarrafal, Cidade Velha…) que as
// imagens da galeria na categoria "Destinos" escolhem. Alimenta "Para onde ir
// a partir da Praia" na página inicial e os filtros por local da galeria.
// Um local com imagens não se apaga (o backend recusa): desativa-se.
export default function DestinationPlacesPage() {
    const { authFetch } = useAuth();
    const [locations, setLocations] = useState<DestinationPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editing, setEditing] = useState<DestinationPlace | null>(null);

    async function fetchLocations() {
        setLoading(true);
        setErr(null);
        try {
            const res = await authFetch(endpoints.destinationPlaces.dashboard);
            if (!res.ok) throw new Error("Erro ao carregar os destinos.");
            setLocations(await res.json());
        } catch (e: any) {
            setErr(e?.message || "Erro ao carregar os destinos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLocations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function errorMessage(res: Response, fallback: string) {
        const body = await res.json().catch(() => null);
        return body?.message || fallback;
    }

    async function save(id: number | null, data: PlaceFormData) {
        const res = await authFetch(id ? endpoints.destinationPlaces.update(id) : endpoints.destinationPlaces.create, {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await errorMessage(res, "Erro ao guardar o local."));
        const saved: DestinationPlace = await res.json();
        setLocations((prev) => {
            const next = id ? prev.map((l) => (l.id === saved.id ? saved : l)) : [...prev, saved];
            return next.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "pt"));
        });
        return saved;
    }

    const handleSubmit = async (data: PlaceFormData) => {
        setIsSubmitting(true);
        try {
            await save(editing?.id ?? null, data);
            setIsDialogOpen(false);
        } catch (e: any) {
            Swal.fire({ icon: "error", title: "Erro", text: e?.message, confirmButtonColor: "#3085d6" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleActive = async (loc: DestinationPlace) => {
        try {
            await save(loc.id, { name: loc.name, travelTime: loc.travelTime ?? "", sortOrder: loc.sortOrder, active: !loc.active });
        } catch (e: any) {
            Swal.fire({ icon: "error", title: "Erro", text: e?.message, confirmButtonColor: "#3085d6" });
        }
    };

    const handleDelete = async (loc: DestinationPlace) => {
        const result = await Swal.fire({
            title: "Eliminar local?",
            text: `"${loc.name}" deixa de existir na lista de Destinos. Para o esconder do site só temporariamente, use "Desativar".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!result.isConfirmed) return;
        try {
            const res = await authFetch(endpoints.destinationPlaces.delete(loc.id), { method: "DELETE" });
            if (!res.ok) throw new Error(await errorMessage(res, "Erro ao eliminar o local."));
            setLocations((prev) => prev.filter((l) => l.id !== loc.id));
        } catch (e: any) {
            Swal.fire({ icon: "error", title: "Erro", text: e?.message, confirmButtonColor: "#3085d6" });
        }
    };

    const activeCount = locations.filter((l) => l.active).length;

    return (
        <div>
            <TopNav
                title="Destinos"
                subtitle="Locais mostrados em «Para onde ir a partir da Praia» e na galeria"
                right={
                    <button
                        onClick={() => { setEditing(null); setIsDialogOpen(true); }}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus size={16} />
                        <span>Novo local</span>
                    </button>
                }
            />

            <PageShell>
                <div className="max-w-7xl mx-auto space-y-6">
                    {loading ? (
                        <div className="flex flex-col h-[40vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <MapPinned className="w-10 h-10 text-primary animate-pulse" />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">A carregar destinos...</p>
                        </div>
                    ) : err ? (
                        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 text-center">
                            <p className="text-sm font-semibold text-destructive">{err}</p>
                            <button onClick={fetchLocations} className="mt-4 btn-outline">Tentar novamente</button>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-zinc-500">
                                As imagens dos destinos adicionam-se na{" "}
                                <Link href="/dashboard/gallery" className="font-semibold text-primary hover:underline">Galeria</Link>
                                {" "}(categoria Destinos) e escolhem o local desta lista. Só os locais ativos aparecem no site.
                            </p>
                            <DataTable
                                columns={[
                                    { key: "sortOrder", label: "Ordem" },
                                    {
                                        key: "name",
                                        label: "Local",
                                        render: (row: DestinationPlace) => (
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-zinc-50">{row.name}</p>
                                                {row.travelTime && <p className="text-xs text-zinc-500">cerca de {row.travelTime} de carro</p>}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "imageCount",
                                        label: "Imagens",
                                        render: (row: DestinationPlace) => (
                                            <Link href="/dashboard/gallery" className="text-sm font-semibold text-zinc-700 hover:text-primary">
                                                {row.imageCount}
                                            </Link>
                                        ),
                                    },
                                    {
                                        key: "active",
                                        label: "Estado",
                                        render: (row: DestinationPlace) => row.active ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-600 border-emerald-200/50">Ativo</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border bg-zinc-100 text-zinc-500 border-zinc-200/50">Inativo</span>
                                        ),
                                    },
                                    {
                                        key: "actions",
                                        label: "Ações",
                                        render: (row: DestinationPlace) => (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditing(row); setIsDialogOpen(true); }}
                                                    className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-primary transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(row)}
                                                    className="p-2 hover:bg-amber-50 rounded-lg text-zinc-500 hover:text-amber-600 transition-colors"
                                                    title={row.active ? "Desativar (deixa de aparecer no site)" : "Ativar"}
                                                >
                                                    {row.active ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-zinc-500 hover:text-red-600 transition-colors"
                                                    title={row.imageCount > 0 ? "Tem imagens na galeria: desative em vez de eliminar" : "Eliminar"}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ),
                                    },
                                ]}
                                rows={locations}
                            />
                        </>
                    )}
                </div>
            </PageShell>

            <PartnerDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editing ? "Editar local" : "Novo local"}
            >
                <PlaceForm
                    key={editing?.id ?? "new"}
                    initialData={editing ?? undefined}
                    nextSortOrder={locations.reduce((max, l) => Math.max(max, l.sortOrder + 1), 0)}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </PartnerDialog>
        </div>
    );
}
