"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/ui/front/PageHeader";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { GalleryItem } from "@/lib/api/types";

export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Tudo");

    const categories = ["Tudo", "Frota", "Eventos", "Cabo Verde"];

    useEffect(() => {
        const fetchGallery = async () => {
            setLoading(true);
            try {
                const categoryParam = activeCategory === "Tudo" ? "" : `?category=${activeCategory}`;
                const res = await fetch(`${API_BASE_URL}${endpoints.gallery.list}${categoryParam}`);
                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                }
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, [activeCategory]);

    const getImageSrc = (url: string) => {
        if (!url) return "/assets/images/dummy.png";
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        if (url.startsWith('/uploads')) {
            return `${API_BASE_URL}${url}`;
        }
        return url;
    };

    return (
        <main>
            <PageHeader
                titulo="A Nossa Galeria"
                descricao="Explore as nossas fotos, frota e momentos especiais."
            />

            <div className="gallery-section pd-90 bg-white">
                <div className="container">
                    {/* Category Filter */}
                    <div className="row mb-12">
                        <div className="col-md-12 text-center">
                            <div className="gallery-filter flex flex-wrap justify-center gap-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat
                                                ? "bg-blue-600 text-white shadow-xl shadow-blue-200"
                                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="mt-10">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">A carregar momentos...</p>
                                </div>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-gray-400 font-bold">Nenhuma imagem disponível nesta categoria.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {items.map((item) => (
                                    <div key={item.id} className="group relative aspect-square rounded-[40px] overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-3">
                                        <img
                                            src={getImageSrc(item.imageUrl)}
                                            alt={item.title || "Gallery"}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 translate-y-4 group-hover:translate-y-0">
                                            <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                                                {item.category}
                                            </span>
                                            <h4 className="text-white font-black text-2xl mb-3 leading-tight">
                                                {item.title}
                                            </h4>
                                            {item.description && (
                                                <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity delay-200 duration-500">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
