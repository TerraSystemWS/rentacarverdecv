"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DestinationPlace, GalleryItem, MediaAsset } from "@/lib/api/types";
import { Upload, Images } from "lucide-react";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import { useAuth } from "@/app/auth/AuthContext";
import MediaPicker from "@/app/dashboard/_components/MediaPicker";
import TranslationFields from "@/app/ui/dash/TranslationFields";

interface GalleryFormProps {
    initialData?: Partial<GalleryItem>;
    onSubmit: (data: GalleryItem, image?: File) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    error?: string | null;
}

/** Categoria cujas imagens aparecem em "Para onde ir a partir da Praia" (página inicial). */
const DESTINATIONS = "Destinos";

export default function GalleryForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
    error,
}: GalleryFormProps) {
    const [formData, setFormData] = useState<GalleryItem>({
        id: initialData?.id,
        title: initialData?.title || "",
        imageUrl: initialData?.imageUrl || "",
        category: initialData?.category || "Geral",
        description: initialData?.description || "",
        translations: initialData?.translations || {},
        placeId: initialData?.placeId ?? null,
    });
    const isDestination = formData.category === DESTINATIONS;

    // Locais dos Destinos (Conteúdo → Destinos): o local escolhe-se desta lista.
    const { authFetch } = useAuth();
    const [places, setPlaces] = useState<DestinationPlace[] | null>(null);
    useEffect(() => {
        if (!isDestination || places) return;
        authFetch(endpoints.destinationPlaces.dashboard)
            .then((res) => (res.ok ? res.json() : []))
            .then((data: DestinationPlace[]) => setPlaces(data))
            .catch(() => setPlaces([]));
    }, [isDestination, places, authFetch]);
    const selectedPlace = places?.find((p) => p.id === formData.placeId) ?? null;

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // O local só existe nos Destinos: limpa-o ao mudar de categoria.
            ...(name === "category" && value !== DESTINATIONS ? { placeId: null } : {}),
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, selectedImage || undefined);
    };

    const handlePickFromLibrary = (asset: MediaAsset) => {
        setSelectedImage(null);
        setPreview(asset.url);
        setFormData((prev) => ({ ...prev, imageUrl: asset.url }));
        setPickerOpen(false);
    };

    const getImageSrc = (url: string) => {
        if (!url) return "";
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        if (url.startsWith('/uploads')) {
            return `${API_BASE_URL}${url}`;
        }
        return url;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Título da Imagem</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ex: Entrega ao cliente X"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Categoria</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="Geral">Geral</option>
                            <option value="Frota">Nossa Frota</option>
                            <option value="Eventos">Eventos</option>
                            <option value="Cabo Verde">Cabo Verde</option>
                            <option value={DESTINATIONS}>Destinos</option>
                        </select>
                        {isDestination && (
                            <p className="text-xs text-gray-500">
                                As imagens de Destinos aparecem na página inicial em &quot;Para onde ir a partir da Praia&quot; e na galeria, agrupadas por local.
                            </p>
                        )}
                    </div>

                    {isDestination && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <label htmlFor="gallery-place" className="text-sm font-medium text-gray-700">Local *</label>
                                <Link href="/dashboard/destination-places" className="text-xs font-semibold text-blue-600 hover:underline">
                                    Gerir locais
                                </Link>
                            </div>
                            <select
                                id="gallery-place"
                                required
                                value={formData.placeId ?? ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, placeId: e.target.value ? Number(e.target.value) : null }))}
                                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="">{places === null ? "A carregar locais..." : "Escolha o local"}</option>
                                {places?.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}{p.active ? "" : " (inativo)"}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500">
                                {selectedPlace?.travelTime
                                    ? `Tempo de carro: cerca de ${selectedPlace.travelTime} (definido no local).`
                                    : "O tempo de carro define-se no local, em Conteúdo → Destinos."}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                            placeholder="Breve descrição da imagem..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Imagem da Galeria</label>
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {preview ? (
                                <img src={getImageSrc(preview)} alt="Gallery preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="text-gray-300 w-12 h-12" />
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => document.getElementById('gallery-image-upload')?.click()}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                {preview ? "Alterar" : "Enviar do PC"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setPickerOpen(true)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Images className="w-4 h-4" />
                                Biblioteca
                            </button>
                        </div>
                        <input id="gallery-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <MediaPicker
                            isOpen={pickerOpen}
                            category="gallery"
                            onClose={() => setPickerOpen(false)}
                            onSelect={handlePickFromLibrary}
                        />
                    </div>
                </div>
            </div>

            <TranslationFields
                value={formData.translations}
                onChange={(translations) => setFormData((prev) => ({ ...prev, translations }))}
                fields={[
                    { key: "title", label: "Título", source: formData.title },
                    { key: "description", label: "Descrição", type: "textarea", source: formData.description },
                ]}
            />

            {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-200 disabled:opacity-50 transition-all">
                    {isSubmitting ? "A guardar..." : "Guardar na Galeria"}
                </button>
            </div>
        </form>
    );
}
