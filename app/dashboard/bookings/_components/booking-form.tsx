"use client";

import { useState, useEffect } from "react";
import { Car, User, Calendar, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Vehicle, UserRow } from "@/lib/api/types";

interface BookingFormProps {
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    initialData?: any;
}

export default function BookingForm({ onSubmit, onCancel, isSubmitting, initialData }: BookingFormProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [customers, setCustomers] = useState<UserRow[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        userId: initialData?.userId || "",
        vehicleId: initialData?.vehicleId || "",
        startDate: initialData?.start_at ? new Date(initialData.start_at).toISOString().split('T')[0] : "",
        startTime: initialData?.start_at ? new Date(initialData.start_at).toTimeString().split(' ')[0].slice(0, 5) : "10:00",
        endDate: initialData?.end_at ? new Date(initialData.end_at).toISOString().split('T')[0] : "",
        endTime: initialData?.end_at ? new Date(initialData.end_at).toTimeString().split(' ')[0].slice(0, 5) : "10:00",
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadOptions() {
            setLoadingData(true);
            try {
                const [vData, uData] = await Promise.all([
                    apiFetch<Vehicle[]>("/public/vehicles?limit=100"), // Use public or dashboard list
                    apiFetch<UserRow[]>(endpoints.users.list(100))
                ]);
                setVehicles(vData);
                setCustomers(uData.filter(u => !u.roles?.some(r => r === "ROLE_ADMIN")));
            } catch (err: any) {
                console.error("Failed to load form options", err);
            } finally {
                setLoadingData(false);
            }
        }
        loadOptions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.userId || !formData.vehicleId || !formData.startDate || !formData.endDate) {
            setError("Por favor preencha todos os campos obrigatórios.");
            return;
        }

        const start = new Date(`${formData.startDate}T${formData.startTime}:00Z`).toISOString();
        const end = new Date(`${formData.endDate}T${formData.endTime}:00Z`).toISOString();

        if (new Date(start) >= new Date(end)) {
            setError("A data de entrega deve ser posterior à data de levantamento.");
            return;
        }

        try {
            await onSubmit({
                userId: formData.userId,
                vehicleId: parseInt(formData.vehicleId),
                startDate: start,
                endDate: end,
            });
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao processar a reserva.");
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Selection */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-tight text-gray-400">Cliente</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            required
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all appearance-none"
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        >
                            <option value="">Selecionar Cliente...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Vehicle Selection */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-tight text-gray-400">Veículo</label>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            required
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all appearance-none"
                            value={formData.vehicleId}
                            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                        >
                            <option value="">Selecionar Veículo...</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.make} {v.model} - {v.licensePlate}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Start Date & Time */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-tight text-gray-400">Levantamento</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="relative w-32">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="time"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                    </div>
                    {formData.startDate && (
                        <p className="text-[10px] font-bold text-primary mt-1 px-1 italic">
                            Selecionado: {formData.startDate.split('-').reverse().join('/')}
                        </p>
                    )}
                </div>

                {/* End Date & Time */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-tight text-gray-400">Entrega</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                        <div className="relative w-32">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="time"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>
                    {formData.endDate && (
                        <p className="text-[10px] font-bold text-primary mt-1 px-1 italic">
                            Selecionado: {formData.endDate.split('-').reverse().join('/')}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t mt-8">
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
                    className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-extrabold text-white hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    {isSubmitting ? "A processar..." : initialData ? "Atualizar Reserva" : "Confirmar Aluguer"}
                </button>
            </div>
        </form>
    );
}
