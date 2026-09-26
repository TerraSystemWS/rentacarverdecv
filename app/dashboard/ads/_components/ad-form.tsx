"use client";

import { useState } from "react";
import { Advertisement, MediaAsset } from "@/lib/api/types";
import { Upload, AlertTriangle, Images } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/endpoints";
import MediaPicker from "@/app/dashboard/_components/MediaPicker";

// Proporção recomendada por posicionamento — usada para avisar (não
// bloquear) quando a imagem carregada não bate certo, em vez de deixar o
// admin descobrir só depois de publicado que o banner ficou cortado/esticado.
const RECOMMENDED_RATIOS: Record<string, { ratio: number; label: string }> = {
    BANNER: { ratio: 1920 / 600, label: "1920x600px (≈3.2:1)" },
    SIDEBAR: { ratio: 300 / 250, label: "300x250px (≈1.2:1)" },
    POPUP: { ratio: 800 / 600, label: "800x600px (≈4:3)" },
};
const RATIO_TOLERANCE = 0.15;

interface AdFormProps {
    initialData?: Partial<Advertisement>;
    onSubmit: (data: Advertisement, image?: File) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function AdForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: AdFormProps) {
    const [formData, setFormData] = useState<Advertisement>({
        id: initialData?.id,
        title: initialData?.title || "",
        imageUrl: initialData?.imageUrl || "",
        linkUrl: initialData?.linkUrl || "",
        placement: initialData?.placement || "BANNER",
        active: initialData?.active ?? true,
        priority: initialData?.priority || 0,
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
    const [ratioWarning, setRatioWarning] = useState<string | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : val,
        }));
        if (name === 'placement' && preview) {
            checkRatio(getImageSrc(preview), value);
        }
    };

    const checkRatio = (url: string, placement: string) => {
        const recommended = RECOMMENDED_RATIOS[placement];
        if (!recommended) {
            setRatioWarning(null);
            return;
        }
        const img = new Image();
        img.onload = () => {
            const actual = img.width / img.height;
            const diff = Math.abs(actual - recommended.ratio) / recommended.ratio;
            setRatioWarning(
                diff > RATIO_TOLERANCE
                    ? `Esta imagem é ${img.width}x${img.height}px — a proporção recomendada para "${placement}" é ${recommended.label}. A imagem pode ficar cortada ou esticada.`
                    : null
            );
        };
        img.src = url;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreview(url);
            checkRatio(url, formData.placement);
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
        checkRatio(getImageSrc(asset.url), formData.placement);
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
                        <label className="text-sm font-medium text-gray-700">Título / Nome do Anúncio</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ex: Promoção de Verão"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Link URL (opcional)</label>
                        <input
                            name="linkUrl"
                            value={formData.linkUrl}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="https://example.com/promo"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Posicionamento</label>
                            <select
                                name="placement"
                                value={formData.placement}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="BANNER">Banner Principal</option>
                                <option value="SIDEBAR">Barra Lateral</option>
                                <option value="POPUP">Janela Pop-up</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Prioridade</label>
                            <input
                                type="number"
                                step={1}
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                aria-describedby="priority-help"
                                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="0"
                            />
                            <p id="priority-help" className="text-xs text-gray-500">
                                Número inteiro (0, 1, 2…) que define a ordem entre anúncios do mesmo local: o <strong>número mais baixo aparece primeiro</strong>. No pop-up só aparece o de número mais baixo.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="active" className="text-sm font-medium text-gray-700">Ativo / Visível</label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Imagem do Anúncio</label>
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {preview ? (
                                <img src={getImageSrc(preview)} alt="Ad preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="text-gray-300 w-12 h-12" />
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => document.getElementById('ad-image-upload')?.click()}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                {preview ? "Alterar Imagem" : "Enviar do PC"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setPickerOpen(true)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Images className="w-4 h-4" />
                                Media Library
                            </button>
                        </div>
                        <input id="ad-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <MediaPicker
                            isOpen={pickerOpen}
                            category="ads"
                            onClose={() => setPickerOpen(false)}
                            onSelect={handlePickFromLibrary}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Recomendado: {RECOMMENDED_RATIOS.BANNER.label} para Banner, {RECOMMENDED_RATIOS.SIDEBAR.label} para Lateral, {RECOMMENDED_RATIOS.POPUP.label} para Pop-up.
                        </p>
                        {ratioWarning && (
                            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{ratioWarning}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-200 disabled:opacity-50 transition-all">
                    {isSubmitting ? "A guardar..." : "Guardar Anúncio"}
                </button>
            </div>
        </form>
    );
}
