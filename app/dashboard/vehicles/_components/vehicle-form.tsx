"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Vehicle, VehicleImage, PriceDetail, OverviewItem, Feature } from "@/lib/api/types";

interface VehicleFormProps {
    initialData?: Vehicle;
    onSubmit: (data: Vehicle) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function VehicleForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: VehicleFormProps) {
    // Initialize state with default values or existing data
    const [formData, setFormData] = useState<Vehicle>({
        title: "",
        rent_per_day: 0,
        rent_currency: "CVE",
        rent_text: "",
        description: "",
        images: [],
        priceDetails: [],
        overviewItems: [],
        features: [],
        ...initialData,
    });

    // Handle basic field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "rent_per_day" ? parseFloat(value) || 0 : value,
        }));
    };

    // --- Dynamic List Handlers ---

    // Images
    const addImage = () => {
        // Mock upload: in a real app, this would trigger a file picker and upload to server
        const mockUrl = `https://placehold.co/600x400?text=New+Car+Image+${formData.images?.length || 0}`;
        const newImage: VehicleImage = { url: mockUrl, is_main: formData.images?.length === 0 };
        setFormData((prev) => ({ ...prev, images: [...(prev.images || []), newImage] }));
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index),
        }));
    };

    // Prices
    const addPrice = () => {
        setFormData((prev) => ({
            ...prev,
            priceDetails: [...(prev.priceDetails || []), { condition_text: "", price: 0 }],
        }));
    };

    const updatePrice = (index: number, field: keyof PriceDetail, value: any) => {
        const newPrices = [...(formData.priceDetails || [])];
        newPrices[index] = { ...newPrices[index], [field]: value };
        setFormData({ ...formData, priceDetails: newPrices });
    };

    const removePrice = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            priceDetails: prev.priceDetails?.filter((_, i) => i !== index),
        }));
    };

    // Features
    const addFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [...(prev.features || []), { name: "", available: true }],
        }));
    };

    const updateFeature = (index: number, field: keyof Feature, value: any) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData({ ...formData, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index),
        }));
    };

    // Overview Items
    const addOverview = () => {
        setFormData((prev) => ({
            ...prev,
            overviewItems: [...(prev.overviewItems || []), { text: "" }],
        }));
    };

    const updateOverview = (index: number, value: string) => {
        const newItems = [...(formData.overviewItems || [])];
        newItems[index] = { ...newItems[index], text: value };
        setFormData({ ...formData, overviewItems: newItems });
    };

    const removeOverview = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            overviewItems: prev.overviewItems?.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Toyota Yaris 2023"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">Rent Per Day</label>
                        <input
                            name="rent_per_day"
                            type="number"
                            value={formData.rent_per_day}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2 w-24">
                        <label className="text-sm font-medium">Currency</label>
                        <select
                            name="rent_currency"
                            value={formData.rent_currency}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="CVE">CVE</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Comfortable and economic city car..."
                    />
                </div>
            </div>

            <hr />

            {/* Images Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Images</h3>
                    <button
                        type="button"
                        onClick={addImage}
                        className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
                    >
                        <Upload size={16} /> Add Image
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {formData.images?.map((img, idx) => (
                        <div key={idx} className="relative group aspect-video rounded-lg border bg-gray-50 overflow-hidden">
                            <img src={img.url} alt="Vehicle" className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    {(!formData.images || formData.images.length === 0) && (
                        <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed rounded-lg">
                            No images added
                        </div>
                    )}
                </div>
            </div>

            <hr />

            {/* Pricing Details */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Price Rules</h3>
                    <button
                        type="button"
                        onClick={addPrice}
                        className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
                    >
                        <Plus size={16} /> Add Rule
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.priceDetails?.map((price, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                placeholder="Condition (e.g. > 3 days)"
                                value={price.condition_text}
                                onChange={(e) => updatePrice(idx, "condition_text", e.target.value)}
                                className="flex-1 rounded-md border p-2 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={price.price}
                                onChange={(e) => updatePrice(idx, "price", parseFloat(e.target.value) || 0)}
                                className="w-24 rounded-md border p-2 text-sm"
                            />
                            <button type="button" onClick={() => removePrice(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            <hr />

            {/* Features & Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Features</h3>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
                        >
                            <Plus size={16} /> Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.features?.map((feat, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input
                                    placeholder="Feature name"
                                    value={feat.name}
                                    onChange={(e) => updateFeature(idx, "name", e.target.value)}
                                    className="flex-1 rounded-md border p-2 text-sm"
                                />
                                <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Overview</h3>
                        <button
                            type="button"
                            onClick={addOverview}
                            className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
                        >
                            <Plus size={16} /> Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.overviewItems?.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input
                                    placeholder="Detail (e.g. 5 Seats)"
                                    value={item.text}
                                    onChange={(e) => updateOverview(idx, e.target.value)}
                                    className="flex-1 rounded-md border p-2 text-sm"
                                />
                                <button type="button" onClick={() => removeOverview(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Vehicle"}
                </button>
            </div>
        </form>
    );
}
