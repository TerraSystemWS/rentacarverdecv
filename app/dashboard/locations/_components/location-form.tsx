"use client";

import { useState } from "react";
import type { RentalLocation, Translations } from "@/lib/api/types";
import TranslationFields from "@/app/ui/dash/TranslationFields";

export type LocationFormData = {
    name: string;
    address: string;
    sortOrder: number;
    active: boolean;
    translations?: Translations; // ausente = o backend mantém as atuais
};

interface LocationFormProps {
    initialData?: RentalLocation;
    nextSortOrder: number;
    onSubmit: (data: LocationFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const inputCls =
    "w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20";

export default function LocationForm({ initialData, nextSortOrder, onSubmit, onCancel, isSubmitting = false }: LocationFormProps) {
    const [form, setForm] = useState<LocationFormData>({
        name: initialData?.name ?? "",
        address: initialData?.address ?? "",
        sortOrder: initialData?.sortOrder ?? nextSortOrder,
        active: initialData?.active ?? true,
        translations: initialData?.translations ?? {},
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...form, name: form.name.trim(), address: form.address.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label htmlFor="loc-name" className="text-sm font-medium text-gray-700">Nome do local *</label>
                <input
                    id="loc-name"
                    required
                    maxLength={150}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Ex: Aeroporto Internacional Nelson Mandela"
                />
                <p className="text-xs text-gray-500">É este o nome que o cliente vê e que fica guardado na reserva.</p>
            </div>

            <div className="space-y-2">
                <label htmlFor="loc-address" className="text-sm font-medium text-gray-700">Morada / indicações</label>
                <input
                    id="loc-address"
                    maxLength={255}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={inputCls}
                    placeholder="Ex: Praia, Ilha de Santiago"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label htmlFor="loc-order" className="text-sm font-medium text-gray-700">Ordem</label>
                    <input
                        id="loc-order"
                        type="number"
                        step={1}
                        value={form.sortOrder}
                        onChange={(e) => setForm({ ...form, sortOrder: Number.parseInt(e.target.value, 10) || 0 })}
                        className={inputCls}
                        aria-describedby="loc-order-help"
                    />
                    <p id="loc-order-help" className="text-xs text-gray-500">Número inteiro; o mais baixo aparece primeiro na lista.</p>
                </div>

                <div className="flex items-center gap-2 sm:pt-8">
                    <input
                        id="loc-active"
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="loc-active" className="text-sm font-medium text-gray-700">Ativo (aparece no site)</label>
                </div>
            </div>

            <TranslationFields
                value={form.translations}
                onChange={(translations) => setForm({ ...form, translations })}
                fields={[
                    { key: "name", label: "Nome do local", source: form.name },
                    { key: "address", label: "Morada / indicações", source: form.address },
                ]}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-primary px-8 py-2.5 text-sm font-extrabold text-white hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    {isSubmitting ? "A guardar..." : initialData ? "Guardar" : "Criar Local"}
                </button>
            </div>
        </form>
    );
}
