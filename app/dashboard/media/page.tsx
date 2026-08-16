"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Search, Images, Copy } from "lucide-react";
import Swal from "sweetalert2";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { useAuth } from "@/app/auth/AuthContext";
import { MediaAsset } from "@/lib/api/types";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";

const CATEGORIES = ["vehicles", "drivers", "partners", "posts", "gallery", "ads", "company", "misc"];

export default function MediaLibraryPage() {
    const { authFetch } = useAuth();
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState<string>("");

    const fetchAssets = async (cat?: string) => {
        setLoading(true);
        try {
            const res = await authFetch(endpoints.media.list(cat || undefined));
            if (res.ok) setAssets(await res.json());
        } catch (error) {
            console.error("Error fetching media library:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets(category);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await authFetch(`${endpoints.media.upload}?category=${category || "misc"}`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Erro ao enviar ficheiro.");
            const created = await res.json();
            setAssets((prev) => [created, ...prev]);
        } catch (error: any) {
            Swal.fire({ icon: "error", title: "Erro", text: error?.message || "Erro ao enviar ficheiro.", confirmButtonColor: "#3085d6" });
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDelete = async (asset: MediaAsset) => {
        const result = await Swal.fire({
            title: "Apagar ficheiro?",
            text: "Esta ação remove o ficheiro do disco definitivamente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, apagar",
            cancelButtonText: "Cancelar",
        });
        if (!result.isConfirmed) return;

        try {
            const res = await authFetch(endpoints.media.delete(asset.id), { method: "DELETE" });
            if (res.status === 409) {
                const body = await res.json().catch(() => null);
                const usages: string[] = body?.usages || [];
                Swal.fire({
                    icon: "warning",
                    title: "Ficheiro em uso",
                    html: `Este ficheiro ainda está a ser usado e não pode ser apagado:<br/><br/><b>${usages.join("<br/>")}</b>`,
                    confirmButtonColor: "#3085d6",
                });
                return;
            }
            if (!res.ok) throw new Error("Erro ao apagar ficheiro.");
            setAssets((prev) => prev.filter((a) => a.id !== asset.id));
        } catch (error: any) {
            Swal.fire({ icon: "error", title: "Erro", text: error?.message || "Erro ao apagar ficheiro.", confirmButtonColor: "#3085d6" });
        }
    };

    function copyUrl(asset: MediaAsset) {
        navigator.clipboard.writeText(asset.url).then(() => {
            Swal.fire({ icon: "success", title: "Copiado!", text: "URL copiado para a área de transferência.", timer: 1200, showConfirmButton: false });
        });
    }

    const getImageSrc = (url: string) => (url.startsWith("/uploads") ? `${API_BASE_URL}${url}` : url);

    const filtered = assets.filter((a) => a.originalFilename.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <TopNav
                title="Media Library"
                subtitle="Todos os ficheiros carregados para o site — reutilizáveis em qualquer formulário de upload"
                right={
                    <label className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-200">
                        <Upload className="w-5 h-5" />
                        <span className="text-sm">{uploading ? "A enviar..." : "Carregar Ficheiro"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                }
            />
            <PageShell>
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar por nome de ficheiro..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="rounded-2xl border border-gray-200 px-4 py-3.5 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                            >
                                <option value="">Todas as categorias</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {loading ? (
                                <div className="col-span-full py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-gray-400 font-bold text-sm">A carregar biblioteca...</p>
                                    </div>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-gray-400 font-bold flex flex-col items-center gap-3">
                                    <Images className="w-10 h-10 text-gray-200" />
                                    Nenhum ficheiro encontrado.
                                </div>
                            ) : (
                                filtered.map((asset) => (
                                    <div key={asset.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                                        <div className="aspect-square overflow-hidden relative bg-gray-50">
                                            <img
                                                src={getImageSrc(asset.url)}
                                                alt={asset.originalFilename}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
                                                <button
                                                    onClick={() => copyUrl(asset)}
                                                    className="bg-white/90 hover:bg-white text-gray-800 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <Copy className="w-3 h-3" /> Copiar URL
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(asset)}
                                                    className="bg-red-500/90 hover:bg-red-600 text-white py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <Trash2 className="w-3 h-3" /> Apagar
                                                </button>
                                            </div>
                                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full">
                                                <span className="text-[9px] font-black uppercase tracking-wider text-blue-600">{asset.category}</span>
                                            </div>
                                        </div>
                                        <div className="p-2.5">
                                            <p className="text-[11px] font-semibold text-gray-700 truncate" title={asset.originalFilename}>
                                                {asset.originalFilename}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </PageShell>
        </div>
    );
}
