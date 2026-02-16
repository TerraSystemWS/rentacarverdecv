"use client";

import { useState } from "react";
import { GalleryItem } from "@/lib/api/types";
import { Upload } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/endpoints";

interface GalleryFormProps {
    initialData?: Partial<GalleryItem>;
    onSubmit: (data: GalleryItem, image?: File) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function GalleryForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: GalleryFormProps) {
    const [formData, setFormData] = useState<GalleryItem>({
        id: initialData?.id,
        title: initialData?.title || "",
        imageUrl: initialData?.imageUrl || "",
        category: initialData?.category || "Geral",
        description: initialData?.description || "",
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
                        </select>
                    </div>

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
                        <button
                            type="button"
                            onClick={() => document.getElementById('gallery-image-upload')?.click()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {preview ? "Alterar Imagem" : "Selecionar Imagem"}
                        </button>
                        <input id="gallery-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-200 disabled:opacity-50 transition-all">
                    {isSubmitting ? "A guardar..." : "Guardar na Galeria"}
                </button>
            </div>
        </form>
    );
}
