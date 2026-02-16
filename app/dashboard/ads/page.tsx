"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit2, Megaphone, CheckCircle2, XCircle } from "lucide-react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { useAuth } from "@/app/auth/AuthContext";
import { Advertisement } from "@/lib/api/types";
import AdDialog from "./_components/ad-dialog";

export default function AdsPage() {
    const { authFetch } = useAuth();
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Advertisement | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAds = async () => {
        try {
            const res = await authFetch(endpoints.ads.dashboard);
            if (res.ok) {
                const data = await res.json();
                setAds(data);
            }
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const handleCreate = () => {
        setEditingAd(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (ad: Advertisement) => {
        setEditingAd(ad);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem a certeza que deseja eliminar este anúncio?")) return;

        try {
            const res = await authFetch(endpoints.ads.delete(id), { method: "DELETE" });
            if (res.ok) {
                setAds(ads.filter((a) => a.id !== id));
            }
        } catch (error) {
            console.error("Error deleting ad:", error);
        }
    };

    const handleSubmit = async (data: Advertisement, image?: File) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("ad", JSON.stringify(data));
            if (image) {
                formData.append("image", image);
            }

            const url = editingAd ? endpoints.ads.update(editingAd.id!) : endpoints.ads.create;
            const method = editingAd ? "PUT" : "POST";

            const res = await authFetch(url, {
                method,
                body: formData,
            }); // body is FormData

            if (res.ok) {
                fetchAds();
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error("Error saving ad:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredAds = ads.filter((ad) =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.placement.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getImageSrc = (url: string) => {
        if (!url) return "/assets/images/dummy.png";
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        if (url.startsWith('/uploads')) {
            return `${API_BASE_URL}${url}`;
        }
        return url;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <Megaphone className="w-10 h-10 text-blue-600" />
                        Publicidade
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Gira os banners e anúncios do sistema.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-2xl shadow-blue-200 transition-all active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Novo Anúncio
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Pesquisar por título ou posicionamento..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Anúncio</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Posicionamento</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Prioridade</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-gray-400 font-bold text-sm">A carregar anúncios...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAds.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-medium">
                                        Nenhum anúncio encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredAds.map((ad) => (
                                    <tr key={ad.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 aspect-video rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                                                    <img src={getImageSrc(ad.imageUrl)} alt={ad.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{ad.title}</div>
                                                    <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{ad.linkUrl || "Sem link"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-500">
                                                {ad.placement}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            {ad.active ? (
                                                <div className="flex items-center justify-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mx-auto w-fit">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Ativo
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1.5 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mx-auto w-fit">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Inativo
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="font-mono text-gray-400">{ad.priority}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(ad)}
                                                    className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ad.id!)}
                                                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingAd}
                isSubmitting={isSubmitting}
                title={editingAd ? "Editar Anúncio" : "Novo Anúncio"}
            />
        </div>
    );
}
