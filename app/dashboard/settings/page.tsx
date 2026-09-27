"use client";

import { useEffect, useState } from "react";
import { Settings, ShieldAlert, FileText, Loader2, Save, Share2 } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints } from "@/lib/api/endpoints";
import { CompanyProfile } from "@/lib/api/types";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import AppearanceCard from "./appearance/_components/appearance-card";
import Link from "next/link";

export default function SettingsPage() {
    const { authFetch } = useAuth();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Redes sociais — vivem no mesmo CompanyProfile que os dados fiscais
    // (Contas), mas o formulário fica aqui em Sistema/Definições.
    const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
    const [savingSocial, setSavingSocial] = useState(false);

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

    const fetchCompanyProfile = async () => {
        try {
            const res = await authFetch(endpoints.companyProfile.get);
            if (res.ok) setCompanyProfile(await res.json());
        } catch (error) {
            console.error("Error fetching company profile:", error);
        }
    };

    useEffect(() => {
        fetchContent();
        fetchCompanyProfile();
    }, []);

    async function handleSaveSocial() {
        if (!companyProfile) return;
        setSavingSocial(true);
        try {
            const res = await authFetch(endpoints.companyProfile.update, {
                method: "PUT",
                body: JSON.stringify({
                    ...companyProfile,
                    ivaRate: companyProfile.ivaRate ? Number(companyProfile.ivaRate) : undefined,
                }),
            });
            if (!res.ok) throw new Error("Erro ao guardar redes sociais.");
            setCompanyProfile(await res.json());
            Swal.fire({ icon: "success", title: "Sucesso", text: "Redes sociais atualizadas.", confirmButtonColor: "#3085d6" });
        } catch (e: any) {
            Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao guardar redes sociais.", confirmButtonColor: "#3085d6" });
        } finally {
            setSavingSocial(false);
        }
    }

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
                Swal.fire({ icon: "error", title: "Erro", text: "Erro ao salvar definições.", confirmButtonColor: "#3085d6" });
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            Swal.fire({ icon: "error", title: "Erro", text: "Erro ao atualizar definições.", confirmButtonColor: "#3085d6" });
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
                    {/* Aparência: tema de cores do site público */}
                    <AppearanceCard />

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

                    {/* Redes Sociais */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-pink-50 text-pink-600">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Redes Sociais</h3>
                                <p className="text-sm text-gray-500 font-medium">Links usados no rodapé e na página de contacto do site público — cada ícone só aparece se o link estiver preenchido.</p>
                            </div>
                        </div>

                        {!companyProfile ? (
                            <div className="flex justify-center py-6">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500">Facebook (opcional)</label>
                                        <input
                                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                            value={companyProfile.facebookUrl ?? ""}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, facebookUrl: e.target.value })}
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500">Instagram (opcional)</label>
                                        <input
                                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                            value={companyProfile.instagramUrl ?? ""}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, instagramUrl: e.target.value })}
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500">Twitter / X (opcional)</label>
                                        <input
                                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                            value={companyProfile.twitterUrl ?? ""}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, twitterUrl: e.target.value })}
                                            placeholder="https://x.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500">WhatsApp (opcional)</label>
                                        <input
                                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                            value={companyProfile.whatsappUrl ?? ""}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, whatsappUrl: e.target.value })}
                                            placeholder="https://wa.me/238..."
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveSocial}
                                    disabled={savingSocial}
                                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors text-sm disabled:opacity-50"
                                >
                                    {savingSocial ? "A guardar..." : "Guardar Redes Sociais"}
                                </button>
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

                    {/* Backups */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                                <Save size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Backups e Restauro</h3>
                                <p className="text-sm text-gray-500 font-medium">Faça o download de backups para o seu PC ou restaure dados de backups antigos.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* DB Backup */}
                            <div className="border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Base de Dados (.dump)</h4>
                                    <p className="text-sm text-gray-500 mb-6">Contém todos os veículos, reservas, clientes e definições textuais em formato PostgreSQL.</p>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={async () => {
                                            const result = await Swal.fire({
                                                title: "Atenção",
                                                text: "O download da base de dados pode demorar alguns segundos. Deseja continuar?",
                                                icon: "info",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Sim, continuar",
                                                cancelButtonText: "Cancelar"
                                            });
                                            if (!result.isConfirmed) return;
                                            setSubmitting(true);
                                            try {
                                                const res = await authFetch(endpoints.settings.backupDb);
                                                if (!res.ok) throw new Error("Erro ao gerar backup");
                                                const blob = await res.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = "database_backup.dump";
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            } catch (e: any) {
                                                Swal.fire({ icon: "error", title: "Erro", text: e.message || "Erro de rede ao baixar ficheiro.", confirmButtonColor: "#3085d6" });
                                            } finally {
                                                setSubmitting(false);
                                            }
                                        }}
                                        disabled={submitting}
                                        className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Exportar Base de Dados
                                    </button>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".dump"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const result = await Swal.fire({
                                                    title: "Tem a certeza absoluta?",
                                                    text: "Todos os dados atuais serão substituídos pelos do backup!",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#d33",
                                                    cancelButtonColor: "#3085d6",
                                                    confirmButtonText: "Sim, restaurar",
                                                    cancelButtonText: "Cancelar"
                                                });
                                                if (!result.isConfirmed) return;

                                                setSubmitting(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const res = await authFetch(endpoints.settings.restoreDb, {
                                                        method: "POST",
                                                        body: formData
                                                    });
                                                    if (res.ok) Swal.fire({ icon: "success", title: "Sucesso", text: "Base de dados restaurada com sucesso!", confirmButtonColor: "#3085d6" });
                                                    else Swal.fire({ icon: "error", title: "Erro", text: "Erro ao restaurar base de dados.", confirmButtonColor: "#3085d6" });
                                                } finally {
                                                    setSubmitting(false);
                                                    e.target.value = "";
                                                }
                                            }}
                                        />
                                        <button disabled={submitting} className="w-full px-4 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                            {submitting ? "A processar..." : "Importar Base de Dados"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Uploads Backup */}
                            <div className="border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Ficheiros de Média (.zip)</h4>
                                    <p className="text-sm text-gray-500 mb-6">Contém todas as imagens da galeria e fotos de veículos (Pasta Uploads).</p>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={async () => {
                                            const result = await Swal.fire({
                                                title: "Atenção",
                                                text: "Este pacote ZIP pode ser muito pesado dependendo do número de imagens. Deseja iniciar o download?",
                                                icon: "info",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Sim, continuar",
                                                cancelButtonText: "Cancelar"
                                            });
                                            if (!result.isConfirmed) return;
                                            setSubmitting(true);
                                            try {
                                                const res = await authFetch(endpoints.settings.backupUploads);
                                                if (!res.ok) throw new Error("Erro ao gerar pacote de imagens");
                                                const blob = await res.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = "uploads_backup.zip";
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            } catch (e: any) {
                                                Swal.fire({ icon: "error", title: "Erro", text: e.message || "Erro de rede ao baixar pacote.", confirmButtonColor: "#3085d6" });
                                            } finally {
                                                setSubmitting(false);
                                            }
                                        }}
                                        disabled={submitting}
                                        className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Exportar Pasta Média
                                    </button>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".zip"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const result = await Swal.fire({
                                                    title: "Atenção",
                                                    text: "A pasta atual de imagens será substituída pelo conteúdo deste ficheiro ZIP!",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#d33",
                                                    cancelButtonColor: "#3085d6",
                                                    confirmButtonText: "Sim, restaurar",
                                                    cancelButtonText: "Cancelar"
                                                });
                                                if (!result.isConfirmed) return;

                                                setSubmitting(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const res = await authFetch(endpoints.settings.restoreUploads, {
                                                        method: "POST",
                                                        body: formData
                                                    });
                                                    if (res.ok) Swal.fire({ icon: "success", title: "Sucesso", text: "Pasta média restaurada com sucesso!", confirmButtonColor: "#3085d6" });
                                                    else Swal.fire({ icon: "error", title: "Erro", text: "Erro ao restaurar ficheiros de imagem.", confirmButtonColor: "#3085d6" });
                                                } finally {
                                                    setSubmitting(false);
                                                    e.target.value = "";
                                                }
                                            }}
                                        />
                                        <button disabled={submitting} className="w-full px-4 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                            {submitting ? "A processar..." : "Importar Pasta Média"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageShell>
        </div>
    );
}
