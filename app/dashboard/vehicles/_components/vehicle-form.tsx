"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/api/types";
import { Upload, X } from "lucide-react";

interface VehicleFormProps {
    initialData?: Partial<Vehicle>;
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
    const [formData, setFormData] = useState<Vehicle>({
        id: initialData?.id || 0,
        make: initialData?.make || "",
        model: initialData?.model || "",
        year: initialData?.year || new Date().getFullYear(),
        licensePlate: initialData?.licensePlate || "",
        pricePerDay: initialData?.pricePerDay || 0,
        available: initialData?.available ?? true,
        imageUrl: initialData?.imageUrl || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let val: any = value;
        if (type === "number") {
            val = parseFloat(value) || 0;
        } else if (type === "checkbox") {
            // TS safe cast if we were using checkbox input
            val = (e.target as HTMLInputElement).checked;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Make */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Make</label>
                    <input
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Toyota"
                    />
                </div>

                {/* Model */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Model</label>
                    <input
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Hilux"
                    />
                </div>

                {/* Year */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Year</label>
                    <input
                        name="year"
                        type="number"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>

                {/* License Plate */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">License Plate</label>
                    <input
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:normal-case font-mono"
                        placeholder="CV-00-AA"
                    />
                </div>

                {/* Price Per Day */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Price Per Day (CVE)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">Wait...</span>
                        <input
                            name="pricePerDay"
                            type="number"
                            value={formData.pricePerDay}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full rounded-lg border border-gray-300 p-2.5 pl-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Availability */}
                <div className="space-y-2 md:pt-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="available"
                                checked={formData.available}
                                onChange={handleCheckboxChange}
                                className="peer sr-only"
                            />
                            <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Available for rent</span>
                    </label>
                </div>

                {/* Image URL */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Image URL</label>
                    <div className="flex gap-2">
                        <input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            required
                            className="flex-1 rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            placeholder="https://..."
                        />
                    </div>
                    {formData.imageUrl && (
                        <div className="mt-2 relative aspect-video w-full md:w-1/2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
                >
                    {isSubmitting ? "Saving..." : "Save Vehicle"}
                </button>
            </div>
        </form>
    );
}
