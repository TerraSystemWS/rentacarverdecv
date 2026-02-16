"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit2, Image as ImageIcon, Calendar } from "lucide-react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { useAuth } from "@/app/auth/AuthContext";
import { GalleryItem } from "@/lib/api/types";
import GalleryDialog from "./_components/gallery-dialog";

export default function GalleryPage() {
    const { authFetch } = useAuth();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchItems = async () => {
        try {
            const res = await authFetch(endpoints.gallery.dashboard);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Error fetching gallery items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleCreate = () => {
        setEditingItem(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: GalleryItem) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem a certeza que deseja eliminar esta imagem da galeria?")) return;

        try {
            const res = await authFetch(endpoints.gallery.delete(id), { method: "DELETE" });
            if (res.ok) {
                setItems(items.filter((a) => a.id !== id));
            }
        } catch (error) {
            console.error("Error deleting gallery item:", error);
        }
    };

    const handleSubmit = async (data: GalleryItem, image?: File) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("galleryItem", JSON.stringify(data));
            if (image) {
                formData.append("image", image);
            }

            const url = editingItem ? endpoints.gallery.update(editingItem.id!) : endpoints.gallery.create;
            const method = editingItem ? "PUT" : "POST";

            const res = await authFetch(url, {
                method,
                body: formData,
            });

            if (res.ok) {
                fetchItems();
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error("Error saving gallery item:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredItems = items.filter((item) =>
        (item.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (item.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
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
                        <ImageIcon className="w-10 h-10 text-blue-600" />
                        Galeria
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Gira as imagens e fotos da empresa.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-2xl shadow-blue-200 transition-all active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Nova Imagem
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Pesquisar por título ou categoria..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-gray-400 font-bold text-sm">A carregar galeria...</p>
                            </div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-400 font-medium font-bold">
                            Nenhuma imagem encontrada na galeria.
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-b-4 border-b-transparent hover:border-b-blue-500">
                                <div className="aspect-square overflow-hidden relative">
                                    <img
                                        src={getImageSrc(item.imageUrl)}
                                        alt={item.title || "Gallery Item"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <p className="text-white text-xs font-medium line-clamp-2 mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">
                                            {item.description || "Sem descrição"}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="flex-1 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-blue-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id!)}
                                                className="flex-1 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {item.title || "Sem título"}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2 text-gray-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Data desconhecida"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <GalleryDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                isSubmitting={isSubmitting}
                title={editingItem ? "Editar Imagem" : "Nova Imagem"}
            />
        </div>
    );
}
