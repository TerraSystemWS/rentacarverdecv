"use client";

import { useState, useEffect } from "react";
import { Post } from "@/lib/api/types";
import { Upload, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/endpoints";

interface PostFormProps {
    initialData?: Partial<Post>;
    onSubmit: (data: Post, image?: File) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function PostForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: PostFormProps) {
    const [formData, setFormData] = useState<Post>({
        id: initialData?.id as number | undefined,
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        content: initialData?.content || "",
        summary: initialData?.summary || "",
        imageUrl: initialData?.imageUrl || "",
        author: initialData?.author || "",
        status: initialData?.status || "DRAFT",
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);

    // Auto-generate slug from title
    useEffect(() => {
        if (!initialData?.id && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, initialData?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Título</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-lg font-bold"
                            placeholder="Ex: Novo carro na frota"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Slug (URL)</label>
                        <input
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm bg-gray-50"
                            placeholder="novo-carro-na-frota"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Autor</label>
                    <input
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Nome do autor"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="DRAFT">Rascunho</option>
                        <option value="PUBLISHED">Publicado</option>
                    </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Resumo</label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        placeholder="Breve descrição do post..."
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Conteúdo (HTML suportado)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={8}
                        className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 font-sans"
                        placeholder="Escreva aqui o conteúdo do seu post..."
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Imagem de Destaque</label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-40 aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {preview ? (
                                <img src={getImageSrc(preview)} alt="Post preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="text-gray-300 w-8 h-8" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => document.getElementById('post-image-upload')?.click()}
                            className="btn-secondary text-xs h-10 px-4"
                        >
                            Alterar Imagem
                        </button>
                        <input id="post-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-200 disabled:opacity-50 transition-all">
                    {isSubmitting ? "A guardar..." : "Guardar Post"}
                </button>
            </div>
        </form>
    );
}
