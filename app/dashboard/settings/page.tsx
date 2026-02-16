"use client";

import { useEffect, useState } from "react";
import { Settings, ShieldAlert, FileText, Loader2, Save } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints } from "@/lib/api/endpoints";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import Link from "next/link";

export default function SettingsPage() {
    const { authFetch } = useAuth();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchContent = async () => {
        try {
            const res = await authFetch(endpoints.content.dashboard);
            if (res.ok) {
                const data = await res.json();
                setContent(data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleToggleMaintenance = async () => {
        if (!content) return;

        const updatedContent = {
            ...content,
            settings: {
                ...(content.settings || { maintenanceMode: 0 }),
                maintenanceMode: (content.settings?.maintenanceMode === 1) ? 0 : 1
            }
        };

        setContent(updatedContent);
        await saveSettings(updatedContent);
    };

    const saveSettings = async (newData: any) => {
        setSubmitting(true);
        try {
            const res = await authFetch(endpoints.content.update, {
                method: "PUT",
                body: JSON.stringify(newData)
            });
            if (res.ok) {
                // Success
            } else {
                alert("Erro ao salvar definições.");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Erro ao atualizar definições.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!content) return null;

    return (
        <div className="pb-20">
            <TopNav
                title="Definições do Sistema"
                subtitle="Configure as opções globais e manutenção"
            />

            <PageShell>
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Modo de Manutenção */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Modo de Manutenção</h3>
                                    <p className="text-sm text-gray-500 font-medium">Quando ativo, o site público exibirá uma mensagem de manutenção.</p>
                                </div>
                            </div>

                            <button
                                onClick={handleToggleMaintenance}
                                disabled={submitting}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${content.settings?.maintenanceMode === 1 ? 'bg-amber-500' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${content.settings?.maintenanceMode === 1 ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {content.settings?.maintenanceMode === 1 && (
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                <ShieldAlert size={18} />
                                Atenção: O site público está atualmente em modo de manutenção.
                            </div>
                        )}
                    </div>

                    {/* Gestão de Conteúdo Link */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Conteúdo Estático</h3>
                                    <p className="text-sm text-gray-500 font-medium">Edite os textos das páginas Sobre Nós, Contacto e Início.</p>
                                </div>
                            </div>

                            <Link
                                href="/dashboard/content"
                                className="px-6 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all border border-gray-200 flex items-center gap-2"
                            >
                                <FileText size={18} />
                                Gerir Conteúdo
                            </Link>
                        </div>
                    </div>
                </div>
            </PageShell>
        </div>
    );
}
