"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/api/types";
import { Upload, X } from "lucide-react";

interface VehicleFormProps {
    initialData?: Partial<Vehicle>;
    onSubmit: (data: Vehicle, images?: File[]) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const DEFAULT_INTERNAL_FEATURES = [
    "A/C total", "Som Premium", "Vídeo/Multimedia", "Kit Especial", "Saída de Emergência",
    "Insonorização", "Rastreador Satélite", "Aquecimento", "Água Mineral", "Bebidas Frias"
];

const DEFAULT_EXTERNAL_FEATURES = [
    "4 Portas", "Espelhos Retrovisores", "Sistema Hidráulico", "Faróis LED",
    "Combustível Reserva", "Travão de Emergência", "Kit de Segurança"
];

export default function VehicleForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: VehicleFormProps) {
    const [formData, setFormData] = useState<Vehicle>({
        id: initialData?.id,
        make: initialData?.make || "",
        model: initialData?.model || "",
        year: initialData?.year || new Date().getFullYear(),
        licensePlate: initialData?.licensePlate || "",
        pricePerDay: initialData?.pricePerDay || 0,
        available: initialData?.available ?? true,
        images: initialData?.images || [],
        classType: initialData?.classType || "Compacto",
        gearbox: initialData?.gearbox || "Automático",
        mileage: initialData?.mileage || "Ilimitada",
        maxPassengers: initialData?.maxPassengers || 5,
        fuelType: initialData?.fuelType || "Gasolina",
        maxLuggage: initialData?.maxLuggage || 1,
        fuelUsage: initialData?.fuelUsage || "5-6L/100km",
        doors: initialData?.doors || 4,
        engineCapacity: initialData?.engineCapacity || "1400 ccm",
        deposit: initialData?.deposit || 110,
        internalFeatures: initialData?.internalFeatures || [],
        externalFeatures: initialData?.externalFeatures || [],
    });

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ id?: number; url: string; isNew?: boolean }[]>(
        initialData?.images?.map(img => ({ ...img })) || []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let val: any = value;
        if (type === "number") {
            val = parseFloat(value) || 0;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedImages(prev => [...prev, ...files]);
            const newPreviews = files.map(file => ({
                url: URL.createObjectURL(file),
                isNew: true
            }));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const preview = previews[index];
        if (preview.isNew) {
            // It's a newly selected file, find its index in selectedImages
            // This is a bit tricky if multiple files have same name, but good enough for now
            // Better: find by blob url
            const newImagesCount = previews.slice(0, index).filter(p => p.isNew).length;
            setSelectedImages(prev => prev.filter((_, i) => i !== newImagesCount));
        } else {
            // It's an existing image from server
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => {
                    const existingIndex = previews.slice(0, index).filter(p => !p.isNew).length;
                    return i !== existingIndex;
                })
            }));
        }
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    }

    const handleFeatureToggle = (type: 'internal' | 'external', feature: string) => {
        const field = type === 'internal' ? 'internalFeatures' : 'externalFeatures';
        setFormData(prev => {
            const current = (prev[field] || []) as string[];
            const updated = current.includes(feature)
                ? current.filter(f => f !== feature)
                : [...current, feature];
            return { ...prev, [field]: updated };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, selectedImages);
    };

    const getImageSrc = (url: string) => {
        if (!url) return "";
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        if (url.startsWith('/uploads')) {
            return `http://localhost:8090${url}`;
        }
        return url;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Basic Info */}
                <div className="space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Informação Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Marca</label>
                            <input name="make" value={formData.make} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Ex: Toyota" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Modelo</label>
                            <input name="model" value={formData.model} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Ex: Hilux" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Ano</label>
                            <input name="year" type="number" value={formData.year} onChange={handleChange} required min="1990" className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Matrícula</label>
                            <input name="licensePlate" value={formData.licensePlate} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 uppercase font-mono" placeholder="CV-00-AA" />
                        </div>
                    </div>
                </div>

                {/* Rental Details */}
                <div className="space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Aluguer & Logística</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preço por Dia (CVE)</label>
                            <input name="pricePerDay" type="number" value={formData.pricePerDay} onChange={handleChange} required min="0" className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Depósito (CVE/EUR)</label>
                            <input name="deposit" type="number" value={formData.deposit} onChange={handleChange} required min="0" className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Disponibilidade</label>
                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name="available" checked={formData.available} onChange={handleCheckboxChange} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">Disponível para aluguer</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specs */}
                <div className="space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Especificações Técnicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Classe</label>
                            <select name="classType" value={formData.classType} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none">
                                <option value="Compacto">Compacto</option>
                                <option value="SUV">SUV</option>
                                <option value="Luxo">Luxo</option>
                                <option value="Económico">Económico</option>
                                <option value="Carrinha">Carrinha</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Caixa</label>
                            <select name="gearbox" value={formData.gearbox} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none">
                                <option value="Automático">Automático</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Combustível</label>
                            <input name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none" placeholder="Ex: Gasolina" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Cilindrada</label>
                            <input name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none" placeholder="Ex: 1400 ccm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Consumo</label>
                            <input name="fuelUsage" value={formData.fuelUsage} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none" placeholder="Ex: 5-6L/100km" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Quilometragem</label>
                            <input name="mileage" value={formData.mileage} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none" placeholder="Ex: Ilimitada" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Passageiros (Máx)</label>
                            <input name="maxPassengers" type="number" value={formData.maxPassengers} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Malas (Máx)</label>
                            <input name="maxLuggage" type="number" value={formData.maxLuggage} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Portas</label>
                            <input name="doors" type="number" value={formData.doors} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none" />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Funcionalidades</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">Funcionalidades Internas</h4>
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_INTERNAL_FEATURES.map(feature => (
                                    <button
                                        key={feature}
                                        type="button"
                                        onClick={() => handleFeatureToggle('internal', feature)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${formData.internalFeatures?.includes(feature)
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {feature}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">Funcionalidades Externas</h4>
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_EXTERNAL_FEATURES.map(feature => (
                                    <button
                                        key={feature}
                                        type="button"
                                        onClick={() => handleFeatureToggle('external', feature)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${formData.externalFeatures?.includes(feature)
                                            ? "bg-green-600 text-white shadow-md shadow-green-200"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {feature}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images Upload */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Imagens do Veículo</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                                <img src={getImageSrc(preview.url)} alt="Preview" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <X size={14} />
                                </button>
                                {preview.isNew && <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-blue-500 text-[10px] text-white font-bold rounded">NOVO</span>}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500"
                        >
                            <Upload size={24} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Adicionar Foto</span>
                        </button>
                    </div>
                    <input id="image-upload" type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-200 disabled:opacity-50 transition-all">
                    {isSubmitting ? "A guardar..." : "Guardar Veículo"}
                </button>
            </div>
        </form>
    );
}
