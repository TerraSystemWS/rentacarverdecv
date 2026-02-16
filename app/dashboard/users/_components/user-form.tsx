"use client";

import { useState } from "react";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

interface UserFormProps {
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export default function UserForm({ onSubmit, onCancel, isSubmitting }: UserFormProps) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("As palavras-passe não coincidem.");
            return;
        }

        if (formData.password.length < 6) {
            setError("A palavra-passe deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            await onSubmit({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao criar o utilizador.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-tight text-gray-400">Nome de Utilizador</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                            placeholder="ex: joaosilva"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-tight text-gray-400">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            required
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                            placeholder="ex: joao@exemplo.pt"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-tight text-gray-400">Palavra-passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-tight text-gray-400">Confirmar</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-extrabold text-white hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    {isSubmitting ? "A criar..." : "Criar Administrador"}
                </button>
            </div>
        </form>
    );
}
