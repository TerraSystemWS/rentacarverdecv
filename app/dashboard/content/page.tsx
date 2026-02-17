"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Layout, Info, Phone, Home } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";

export default function ContentPage() {
    const { authFetch } = useAuth();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("about");

    const fetchContent = async () => {
        try {
            const res = await authFetch(endpoints.content.dashboard);
            if (res.ok) {
                const data = await res.json();
                setContent(data);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleChange = (section: string, field: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNestedChange = (section: string, subsection: string, field: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section][subsection],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await authFetch(endpoints.content.update, {
                method: "PUT",
                body: JSON.stringify(content)
            });
            if (res.ok) {
                alert("Conteúdo atualizado com sucesso!");
            }
        } catch (error) {
            console.error("Error updating content:", error);
            alert("Erro ao atualizar conteúdo.");
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

    const tabs = [
        { id: "about", label: "Sobre Nós", icon: Info },
        { id: "contact", label: "Contacto", icon: Phone },
        { id: "home", label: "Início", icon: Home },
    ];

    return (
        <div className="pb-20">
            <TopNav
                title="Gestão de Conteúdo"
                subtitle="Edite os textos estáticos do site"
                right={
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                        Salvar Alterações
                    </button>
                }
            />

            <PageShell>
                <div className="max-w-4xl mx-auto">
                    <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === "about" && (
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                                <h3 className="text-xl font-black text-gray-900 border-b pb-4">Página Sobre Nós</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título do Cabeçalho</label>
                                        <input
                                            type="text"
                                            value={content.about.headerTitle}
                                            onChange={(e) => handleChange("about", "headerTitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Descrição do Cabeçalho</label>
                                        <input
                                            type="text"
                                            value={content.about.headerDesc}
                                            onChange={(e) => handleChange("about", "headerDesc", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título Principal</label>
                                    <input
                                        type="text"
                                        value={content.about.mainTitle}
                                        onChange={(e) => handleChange("about", "mainTitle", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo Principal</label>
                                    <input
                                        type="text"
                                        value={content.about.mainSubtitle}
                                        onChange={(e) => handleChange("about", "mainSubtitle", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título Grande (Destaque)</label>
                                    <input
                                        type="text"
                                        value={content.about.bigTitle}
                                        onChange={(e) => handleChange("about", "bigTitle", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-extrabold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Parágrafo 1</label>
                                    <textarea
                                        rows={4}
                                        value={content.about.p1}
                                        onChange={(e) => handleChange("about", "p1", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Parágrafo 2</label>
                                    <textarea
                                        rows={4}
                                        value={content.about.p2}
                                        onChange={(e) => handleChange("about", "p2", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "contact" && (
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                                <h3 className="text-xl font-black text-gray-900 border-b pb-4">Página de Contacto</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título do Cabeçalho</label>
                                        <input
                                            type="text"
                                            value={content.contact.headerTitle}
                                            onChange={(e) => handleChange("contact", "headerTitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo do Cabeçalho</label>
                                        <input
                                            type="text"
                                            value={content.contact.headerSubtitle}
                                            onChange={(e) => handleChange("contact", "headerSubtitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título de Contacto Direto</label>
                                    <input
                                        type="text"
                                        value={content.contact.directTitle}
                                        onChange={(e) => handleChange("contact", "directTitle", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Morada</label>
                                    <textarea
                                        rows={2}
                                        value={content.contact.address}
                                        onChange={(e) => handleChange("contact", "address", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Telefone</label>
                                        <input
                                            type="text"
                                            value={content.contact.phone}
                                            onChange={(e) => handleChange("contact", "phone", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Email</label>
                                        <input
                                            type="email"
                                            value={content.contact.email}
                                            onChange={(e) => handleChange("contact", "email", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-6">
                                    <h4 className="font-bold text-gray-500">Secção do Mapa</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título do Mapa</label>
                                            <input
                                                type="text"
                                                value={content.contact.mapTitle}
                                                onChange={(e) => handleChange("contact", "mapTitle", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo do Mapa</label>
                                            <input
                                                type="text"
                                                value={content.contact.mapSubtitle}
                                                onChange={(e) => handleChange("contact", "mapSubtitle", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Descrição do Mapa</label>
                                        <input
                                            type="text"
                                            value={content.contact.mapDesc}
                                            onChange={(e) => handleChange("contact", "mapDesc", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "home" && (
                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                                    <h3 className="text-xl font-black text-gray-900 border-b pb-4">Bloco da App</h3>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo Superior</label>
                                        <input
                                            type="text"
                                            value={content.home.app.topSubtitle}
                                            onChange={(e) => handleNestedChange("home", "app", "topSubtitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título Principal</label>
                                        <input
                                            type="text"
                                            value={content.home.app.title}
                                            onChange={(e) => handleNestedChange("home", "app", "title", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo Inferior</label>
                                        <input
                                            type="text"
                                            value={content.home.app.subtitle}
                                            onChange={(e) => handleNestedChange("home", "app", "subtitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                                    <h3 className="text-xl font-black text-gray-900 border-b pb-4">Números (Fun Facts)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Facto 1 */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 1 (Número)</label>
                                            <input
                                                type="number"
                                                value={content.home.funFacts.f1Num || 0}
                                                onChange={(e) => handleNestedChange("home", "funFacts", "f1Num", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 1 (Texto)</label>
                                            <input
                                                type="text"
                                                value={content.home.funFacts.f1}
                                                onChange={(e) => handleNestedChange("home", "funFacts", "f1", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>

                                        {/* Facto 2 */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 2 (Número)</label>
                                            <input
                                                type="number"
                                                value={content.home.funFacts.f2Num || 0}
                                                onChange={(e) => handleNestedChange("home", "funFacts", "f2Num", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 2 (Texto)</label>
                                            <input
                                                type="text"
                                                value={content.home.funFacts.f2}
                                                onChange={(e) => handleNestedChange("home", "funFacts", "f2", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>

                                        {/* Facto 3 */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 3 (Número)</label>
                                            <input
                                                type="number"
                                                value={content.home.funFacts.f3Num || 0}
                                                onChange={(e) => handleNestedChange("home", "funFacts", "f3Num", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 3 (Texto)</label>
                                            <input
                                                type="text"
                                                value={content.home.funFacts.f3}
                                                onChange={(e) => handleNestedChange("home", "funFacts", "f3", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>

                                        {/* Facto 4 */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 4 (Número)</label>
                                            <input
                                                type="number"
                                                value={content.home.funFacts.f4Num || 0}
                                                onChange={(e) => handleNestedChange("home", "funFacts", "f4Num", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 4 (Texto)</label>
                                            <input
                                                type="text"
                                                value={content.home.funFacts.f4}
                                                onChange={(e) => handleNestedChange("home", "funFacts", "f4", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </PageShell>
        </div>
    );
}
