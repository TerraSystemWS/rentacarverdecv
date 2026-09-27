"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Layout, Info, Phone, Home, ScrollText, Undo2 } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import RichTextEditor from "@/app/ui/dash/RichTextEditor";
import { getPath, setPath } from "@/lib/i18n/contentFields";

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

    // Língua em edição: PT é o texto original; EN/FR gravam-se em
    // content.i18n.<língua> com o mesmo caminho (ver lib/i18n/contentFields.ts).
    // Campo vazio em EN/FR = o site mostra o texto por omissão dessa língua.
    const [lang, setLang] = useState<"pt" | "en" | "fr">("pt");
    // Iguais em todas as línguas: editam sempre o valor PT.
    const SHARED = new Set(["contact.phone", "contact.email", "home.funFacts.f4Num"]);
    const fullPath = (path: string) => (lang === "pt" || SHARED.has(path) ? path : `i18n.${lang}.${path}`);
    const sharedLocked = (path: string) => lang !== "pt" && SHARED.has(path);
    const val = (path: string) => {
        const v = getPath(content, fullPath(path));
        return typeof v === "string" || typeof v === "number" ? v : "";
    };
    const setVal = (path: string, value: string) => setContent((prev: any) => setPath(prev, fullPath(path), value));
    // Texto PT de referência para quem traduz.
    const ptHint = (path: string) => (lang === "pt" ? undefined : String(getPath(content, path) ?? ""));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await authFetch(endpoints.content.update, {
                method: "PUT",
                body: JSON.stringify(content)
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Sucesso", text: "Conteúdo atualizado com sucesso!", confirmButtonColor: "#3085d6" });
            }
        } catch (error) {
            console.error("Error updating content:", error);
            Swal.fire({ icon: "error", title: "Erro", text: "Erro ao atualizar conteúdo.", confirmButtonColor: "#3085d6" });
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
        { id: "conditions", label: "Condições Gerais", icon: ScrollText },
        { id: "cancellation", label: "Cancelamento", icon: Undo2 },
    ];

    // Páginas legais (texto rico). O backend preenche estes campos com o
    // texto por omissão (content-defaults/*.html) enquanto não forem editados.
    const legalPages = [
        { id: "conditions", title: "Condições Gerais de Aluguer", url: "/condicoes-gerais", hint: "Deve corresponder ao documento em papel entregue com o contrato de aluguer." },
        { id: "cancellation", title: "Política de Cancelamento e Reembolso", url: "/politica-cancelamento", hint: "Exigida pela SISP para aceitar pagamentos online (checklist, ponto 6)." },
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
                    <div className="flex flex-wrap bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 gap-2">
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

                    <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
                        <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Língua</span>
                        {([["pt", "Português"], ["en", "English"], ["fr", "Français"]] as const).map(([code, label]) => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => setLang(code)}
                                aria-pressed={lang === code}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${lang === code ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                            >
                                {label}
                            </button>
                        ))}
                        {lang !== "pt" && (
                            <p className="w-full text-xs text-gray-500">
                                A editar a tradução em {lang === "en" ? "inglês" : "francês"}. O texto em português aparece como referência (em cinzento).
                                Campos vazios mostram no site o texto por omissão desta língua; nas páginas legais sem tradução, o site mostra o texto em português com um aviso.
                            </p>
                        )}
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
                                            value={String(val("about.headerTitle"))}
                                            placeholder={ptHint("about.headerTitle")}
                                            onChange={(e) => setVal("about.headerTitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Descrição do Cabeçalho</label>
                                        <input
                                            type="text"
                                            value={String(val("about.headerDesc"))}
                                            placeholder={ptHint("about.headerDesc")}
                                            onChange={(e) => setVal("about.headerDesc", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título Principal</label>
                                    <input
                                        type="text"
                                        value={String(val("about.mainTitle"))}
                                        placeholder={ptHint("about.mainTitle")}
                                        onChange={(e) => setVal("about.mainTitle", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo Principal</label>
                                    <input
                                        type="text"
                                        value={String(val("about.mainSubtitle"))}
                                        placeholder={ptHint("about.mainSubtitle")}
                                        onChange={(e) => setVal("about.mainSubtitle", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título Grande (Destaque)</label>
                                    <input
                                        type="text"
                                        value={String(val("about.bigTitle"))}
                                        placeholder={ptHint("about.bigTitle")}
                                        onChange={(e) => setVal("about.bigTitle", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-extrabold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Parágrafo 1</label>
                                    <PtReference html={ptHint("about.p1")} />
                                    <RichTextEditor
                                        key={`${lang}-about.p1`}
                                        value={String(val("about.p1"))}
                                        onChange={(html) => setVal("about.p1", html)}
                                        minHeight={120}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Parágrafo 2</label>
                                    <PtReference html={ptHint("about.p2")} />
                                    <RichTextEditor
                                        key={`${lang}-about.p2`}
                                        value={String(val("about.p2"))}
                                        onChange={(html) => setVal("about.p2", html)}
                                        minHeight={120}
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
                                            value={String(val("contact.headerTitle"))}
                                            placeholder={ptHint("contact.headerTitle")}
                                            onChange={(e) => setVal("contact.headerTitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo do Cabeçalho</label>
                                        <input
                                            type="text"
                                            value={String(val("contact.headerSubtitle"))}
                                            placeholder={ptHint("contact.headerSubtitle")}
                                            onChange={(e) => setVal("contact.headerSubtitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título de Contacto Direto</label>
                                    <input
                                        type="text"
                                        value={String(val("contact.directTitle"))}
                                        placeholder={ptHint("contact.directTitle")}
                                        onChange={(e) => setVal("contact.directTitle", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Morada</label>
                                    <textarea
                                        rows={2}
                                        value={String(val("contact.address"))}
                                        placeholder={ptHint("contact.address")}
                                        onChange={(e) => setVal("contact.address", e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Telefone</label>
                                        <input
                                            type="text"
                                            value={String(val("contact.phone"))}
                                            disabled={sharedLocked("contact.phone")}
                                            title={sharedLocked("contact.phone") ? "Igual em todas as línguas — edite em PT" : undefined}
                                            onChange={(e) => setVal("contact.phone", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Email</label>
                                        <input
                                            type="email"
                                            value={String(val("contact.email"))}
                                            disabled={sharedLocked("contact.email")}
                                            title={sharedLocked("contact.email") ? "Igual em todas as línguas — edite em PT" : undefined}
                                            onChange={(e) => setVal("contact.email", e.target.value)}
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
                                                value={String(val("contact.mapTitle"))}
                                                placeholder={ptHint("contact.mapTitle")}
                                                onChange={(e) => setVal("contact.mapTitle", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo do Mapa</label>
                                            <input
                                                type="text"
                                                value={String(val("contact.mapSubtitle"))}
                                                placeholder={ptHint("contact.mapSubtitle")}
                                                onChange={(e) => setVal("contact.mapSubtitle", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Descrição do Mapa</label>
                                        <input
                                            type="text"
                                            value={String(val("contact.mapDesc"))}
                                            placeholder={ptHint("contact.mapDesc")}
                                            onChange={(e) => setVal("contact.mapDesc", e.target.value)}
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
                                            value={val("home.app.topSubtitle")}
                                            placeholder={ptHint("home.app.topSubtitle")}
                                            onChange={(e) => setVal("home.app.topSubtitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título Principal</label>
                                        <input
                                            type="text"
                                            value={val("home.app.title")}
                                            placeholder={ptHint("home.app.title")}
                                            onChange={(e) => setVal("home.app.title", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Subtítulo Inferior</label>
                                        <input
                                            type="text"
                                            value={val("home.app.subtitle")}
                                            placeholder={ptHint("home.app.subtitle")}
                                            onChange={(e) => setVal("home.app.subtitle", e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                                    <h3 className="text-xl font-black text-gray-900 border-b pb-4">Números (Fun Facts)</h3>
                                    <p className="text-xs text-gray-400 -mt-2">
                                        Os números dos Factos 1 a 3 são calculados automaticamente a partir da base de dados (veículos, reservas concluídas e condutores). Só o texto é editável.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Facto 1 */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 1 (Número)</label>
                                            <div className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-black text-lg text-gray-400">
                                                Automático (nº de veículos)
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 1 (Texto)</label>
                                            <input
                                                type="text"
                                                value={val("home.funFacts.f1")}
                                            placeholder={ptHint("home.funFacts.f1")}
                                                onChange={(e) => setVal("home.funFacts.f1", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>

                                        {/* Facto 2 */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 2 (Número)</label>
                                            <div className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-black text-lg text-gray-400">
                                                Automático (reservas concluídas)
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 2 (Texto)</label>
                                            <input
                                                type="text"
                                                value={val("home.funFacts.f2")}
                                            placeholder={ptHint("home.funFacts.f2")}
                                                onChange={(e) => setVal("home.funFacts.f2", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>

                                        {/* Facto 3 */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 3 (Número)</label>
                                            <div className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-black text-lg text-gray-400">
                                                Automático (nº de condutores)
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 3 (Texto)</label>
                                            <input
                                                type="text"
                                                value={val("home.funFacts.f3")}
                                            placeholder={ptHint("home.funFacts.f3")}
                                                onChange={(e) => setVal("home.funFacts.f3", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>

                                        {/* Facto 4 */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 4 (Número)</label>
                                            <input
                                                type="number"
                                                value={val("home.funFacts.f4Num")}
                                            disabled={sharedLocked("home.funFacts.f4Num")}
                                            title={sharedLocked("home.funFacts.f4Num") ? "Igual em todas as línguas — edite em PT" : undefined}
                                                onChange={(e) => setVal("home.funFacts.f4Num", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Facto 4 (Texto)</label>
                                            <input
                                                type="text"
                                                value={val("home.funFacts.f4")}
                                            placeholder={ptHint("home.funFacts.f4")}
                                                onChange={(e) => setVal("home.funFacts.f4", e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {legalPages.map((page) => activeTab === page.id && (
                            <div key={page.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
                                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-4">
                                    <h3 className="text-xl font-black text-gray-900">{page.title}</h3>
                                    <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                                        Ver página {page.url} ↗
                                    </a>
                                </div>
                                <p className="text-sm text-gray-500">{page.hint} As alterações aparecem no site até 1 minuto depois de guardar.</p>
                                <PtReference html={ptHint(`legal.${page.id}`)} />
                                <RichTextEditor
                                    key={`${lang}-${page.id}`}
                                    value={String(val(`legal.${page.id}`))}
                                    onChange={(html) => setVal(`legal.${page.id}`, html)}
                                    minHeight={420}
                                />
                            </div>
                        ))}
                    </form>
                </div>
            </PageShell>
        </div>
    );
}

// Texto original (PT) mostrado por cima dos editores de texto rico quando se
// está a editar uma tradução. O HTML já vem sanitizado pelo backend.
function PtReference({ html }: { html?: string }) {
    if (html === undefined) return null;
    return (
        <details className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            <summary className="cursor-pointer font-bold">Texto original em português</summary>
            <div className="rich-text mt-3 max-h-64 overflow-y-auto" dangerouslySetInnerHTML={{ __html: html || "<p><em>(vazio)</em></p>" }} />
        </details>
    );
}
