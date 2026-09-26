"use client";

import { useState, useEffect } from "react";
import { Post, MediaAsset } from "@/lib/api/types";
import { Upload, Images } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/endpoints";
import MediaPicker from "@/app/dashboard/_components/MediaPicker";
import RichTextEditor from "@/app/ui/dash/RichTextEditor";
import { textToHtml } from "@/lib/utils/legacyText";
import { fmtDateTime } from "@/lib/utils/format";

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
        // Posts antigos em texto simples/**Markdown** abrem já formatados no editor.
        content: textToHtml(initialData?.content),
        summary: initialData?.summary || "",
        imageUrl: initialData?.imageUrl || "",
        author: initialData?.author || "",
        status: initialData?.status || "DRAFT",
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
    const [pickerOpen, setPickerOpen] = useState(false);

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

    const [contentError, setContentError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.content || formData.content.replace(/<[^>]*>/g, "").trim() === "") {
            setContentError(true);
            return;
        }
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
                    {initialData?.newsletterSentAt && initialData.newsletterRecipients === 0 ? (
                        <p className="text-xs text-zinc-500">Newsletter: nenhum email enviado (sem subscritores ou publicada antes da newsletter).</p>
                    ) : initialData?.newsletterSentAt ? (
                        <p className="text-xs text-green-700">
                            Newsletter enviada em {fmtDateTime(initialData.newsletterSentAt)}
                            {initialData.newsletterRecipients != null && ` a ${initialData.newsletterRecipients} subscritor${initialData.newsletterRecipients === 1 ? "" : "es"}`}.
                        </p>
                    ) : formData.status === "PUBLISHED" ? (
                        <p className="text-xs text-amber-700">
                            Ao guardar como publicado, esta novidade é enviada por email a todos os subscritores da newsletter (só uma vez).
                        </p>
                    ) : null}
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
                    <label className="text-sm font-medium text-gray-700">Conteúdo</label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={(html) => {
                            setFormData((prev) => ({ ...prev, content: html }));
                            if (html) setContentError(false);
                        }}
                        minHeight={260}
                    />
                    {contentError && <p className="text-xs font-semibold text-red-600">Escreva o conteúdo da novidade.</p>}
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
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => document.getElementById('post-image-upload')?.click()}
                                className="btn-secondary text-xs h-10 px-4"
                            >
                                Enviar do PC
                            </button>
                            <button
                                type="button"
                                onClick={() => setPickerOpen(true)}
                                className="flex items-center justify-center gap-1.5 btn-secondary text-xs h-10 px-4"
                            >
                                <Images className="w-3.5 h-3.5" />
                                Media Library
                            </button>
                        </div>
                        <input id="post-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <MediaPicker
                            isOpen={pickerOpen}
                            category="posts"
                            onClose={() => setPickerOpen(false)}
                            onSelect={handlePickFromLibrary}
                        />
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
