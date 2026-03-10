"use client";

import { useState } from "react";
import { Driver } from "@/lib/api/types";
import { Upload } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/endpoints";

interface DriverFormProps {
    initialData?: Partial<Driver>;
    onSubmit: (data: Driver, image?: File) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function DriverForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: DriverFormProps) {
    const [formData, setFormData] = useState<Driver>({
        id: initialData?.id as number | undefined,
        name: initialData?.name || "",
        imageUrl: initialData?.imageUrl || "",
        description: initialData?.description || "",
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nome do Motorista</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Ex: Johan Silva"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Ex: Trabalho em tempo integral, 27 anos"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fotografia</label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {preview ? (
                                <img src={getImageSrc(preview)} alt="Image preview" className="w-full h-full object-cover" />
                            ) : (
                                <img
                                    src="/assets/images/driver/avatar-placeholder.png"
                                    alt="Default Driver"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg text-xs h-10 px-4 transition-colors font-semibold"
                        >
                            Alterar Imagem
                        </button>
                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-200 disabled:opacity-50 transition-all">
                    {isSubmitting ? "A guardar..." : "Guardar Motorista"}
                </button>
            </div>
        </form>
    );
}
