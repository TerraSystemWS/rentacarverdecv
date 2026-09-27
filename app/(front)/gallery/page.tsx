"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/app/ui/front/PageHeader";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { DestinationPlace, GalleryItem } from "@/lib/api/types";
import { useLocale, useTranslations } from "next-intl";
import { tr } from "@/lib/i18n/translate";

// Valores em PT (como na BD / API); o rótulo segue a língua.
const CATEGORIES = ["Tudo", "Frota", "Eventos", "Cabo Verde", "Destinos"];
// Imagens com local e tempo de carro; alimentam "Para onde ir a partir da Praia".
const DESTINATIONS = "Destinos";

function GalleryContent() {
    const t = useTranslations("gallery");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtros no URL (?category=Destinos&place=Tarrafal): os cartões da página
    // inicial abrem a galeria já filtrada e o link pode ser partilhado.
    const urlCategory = searchParams.get("category");
    const activeCategory = urlCategory && CATEGORIES.includes(urlCategory) ? urlCategory : "Tudo";
    // ?place=<id do local> (lista Conteúdo → Destinos no dashboard).
    const activePlace = activeCategory === DESTINATIONS ? Number(searchParams.get("place")) || 0 : 0;
    const [places, setPlaces] = useState<DestinationPlace[]>([]);

    const setFilters = (category: string, placeId = 0) => {
        const params = new URLSearchParams();
        if (category !== "Tudo") params.set("category", category);
        if (placeId) params.set("place", String(placeId));
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    const catLabel = (c: string) => (t.has(`categories.${c}`) ? t(`categories.${c}`) : c);

    // Carrega a categoria inteira; o filtro por local é feito aqui, para a
    // lista de locais (sub-filtros) mostrar sempre todos os que existem.
    useEffect(() => {
        const fetchGallery = async () => {
            setLoading(true);
            try {
                const categoryParam =
                    activeCategory === "Tudo" ? "" : `?category=${encodeURIComponent(activeCategory)}`;
                const res = await fetch(
                    `${API_BASE_URL}${endpoints.gallery.list}${categoryParam}`
                );
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

    // Sub-filtros: locais ativos com imagens, pela ordem definida no dashboard.
    useEffect(() => {
        if (activeCategory !== DESTINATIONS || places.length > 0) return;
        fetch(`${API_BASE_URL}${endpoints.destinationPlaces.list}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data: DestinationPlace[]) => setPlaces(Array.isArray(data) ? data : []))
            .catch(() => setPlaces([]));
    }, [activeCategory, places.length]);

    const placeFilters = activeCategory === DESTINATIONS
        ? places.filter((p) => items.some((i) => i.placeId === p.id))
        : [];
    const placeLabel = (p: DestinationPlace) => tr(p, "name", locale);
    const visibleItems = activePlace ? items.filter((i) => i.placeId === activePlace) : items;

    return (
        <main>
            <PageHeader
                titulo={t("title")}
                descricao={t("desc")}
            />

            <div className="gallery-section pd-90 bg-white">
                <div className="container">
                    {/* Category Filter */}
                    <div className="row mb-12">
                        <div className="col-md-12 text-center">
                            <div className="gallery-filter flex flex-wrap justify-center gap-4">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilters(cat)}
                                        aria-pressed={activeCategory === cat}
                                        className={`px-[60px] py-[15px] rounded-[25px] font-['Exo',sans-serif] font-black uppercase text-[16px] tracking-[0.035em] transition-all duration-300 ${activeCategory === cat
                                            ? "bg-[#3baa4e] text-white shadow-lg"
                                            : "bg-gray-100 !text-gray-800 hover:bg-gray-200 hover:!text-black"
                                            }`}
                                    >
                                        {catLabel(cat)}
                                    </button>
                                ))}
                            </div>
                            {placeFilters.length > 0 && (
                                <div className="gallery-filter gallery-filter--places flex flex-wrap justify-center gap-3 mt-6" role="group" aria-label={t("placesLabel")}>
                                    {[null, ...placeFilters].map((place) => (
                                        <button
                                            key={place?.id ?? "all"}
                                            onClick={() => setFilters(DESTINATIONS, place?.id ?? 0)}
                                            aria-pressed={activePlace === (place?.id ?? 0)}
                                            className={`px-[28px] py-[9px] rounded-[25px] font-['Exo',sans-serif] font-bold text-[14px] transition-all duration-300 ${activePlace === (place?.id ?? 0)
                                                ? "bg-[#3baa4e] text-white shadow-lg"
                                                : "bg-gray-100 !text-gray-800 hover:bg-gray-200 hover:!text-black"
                                                }`}
                                        >
                                            {place ? placeLabel(place) : t("allPlaces")}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="mt-10">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        {t("loading")}
                                    </p>
                                </div>
                            </div>
                        ) : visibleItems.length === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-gray-400 font-bold">
                                    {t("empty")}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {visibleItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <img
                                            src={`${API_BASE_URL}${item.imageUrl}`}
                                            alt={tr(item, "title", locale) || t("imageAlt")}
                                            className="!w-full !h-full !max-w-none object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                            <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">
                                                {item.category === DESTINATIONS && item.place
                                                    ? (locale !== "pt" && item.placeTranslations?.[locale as "en" | "fr"]?.name?.trim()) || item.place
                                                    : item.category ? catLabel(item.category) : ""}
                                            </span>
                                            <h4 className="text-white font-bold text-lg leading-tight">
                                                {tr(item, "title", locale)}
                                            </h4>
                                            {item.category === DESTINATIONS && item.travelTime && (
                                                <p className="text-gray-200 text-xs font-semibold mt-1">
                                                    {t("travelTime", { time: item.travelTime })}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-gray-300 text-xs line-clamp-2 mt-2">
                                                    {tr(item, "description", locale)}
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

export default function GalleryPage() {
    return (
        <Suspense fallback={null}>
            <GalleryContent />
        </Suspense>
    );
}
