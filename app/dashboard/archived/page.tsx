"use client";

import { useEffect, useState } from "react";
import { Archive, Car, UserSquare2, Handshake, Megaphone } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints } from "@/lib/api/endpoints";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";

interface ArchivedItem {
    id: number;
    title: string;
    subtitle: string | null;
}

interface ArchivedSummary {
    vehicles: ArchivedItem[];
    drivers: ArchivedItem[];
    partners: ArchivedItem[];
    ads: ArchivedItem[];
}

const empty: ArchivedSummary = { vehicles: [], drivers: [], partners: [], ads: [] };

// "Crie um meio de ver os dados arquivados" (tasks.md) — os itens arquivados
// (viaturas, motoristas, parceiros, campanhas) nunca são apagados, mas
// desaparecem das listagens normais; esta página junta-os todos num só sítio.
export default function ArchivedPage() {
    const { authFetch } = useAuth();
    const [data, setData] = useState<ArchivedSummary>(empty);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authFetch(endpoints.archived.summary)
            .then((res) => (res.ok ? res.json() : empty))
            .then(setData)
            .catch(() => setData(empty))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sections: { key: keyof ArchivedSummary; label: string; icon: any; hint: string; manageHref: string }[] = [
        { key: "vehicles", label: "Veículos", icon: Car, hint: "matrícula", manageHref: "/dashboard/vehicles" },
        { key: "drivers", label: "Motoristas", icon: UserSquare2, hint: "", manageHref: "/dashboard/drivers" },
        { key: "partners", label: "Parceiros", icon: Handshake, hint: "", manageHref: "/dashboard/partners" },
        { key: "ads", label: "Campanhas", icon: Megaphone, hint: "posicionamento", manageHref: "/dashboard/ads" },
    ];

    const total = sections.reduce((sum, s) => sum + data[s.key].length, 0);

    return (
        <div>
            <TopNav title="Arquivados" subtitle="Tudo o que foi arquivado (nunca apagado) em vez de eliminado" />
            <PageShell>
                <div className="max-w-7xl mx-auto space-y-8">
                    {loading ? (
                        <div className="flex flex-col h-[40vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <Archive className="w-10 h-10 text-primary animate-pulse" />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">A carregar arquivo...</p>
                        </div>
                    ) : total === 0 ? (
                        <div className="flex flex-col h-[40vh] items-center justify-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl text-center px-8">
                            <Archive className="w-10 h-10 text-zinc-300" />
                            <p className="text-sm font-bold text-zinc-400">Nada arquivado por agora — tudo o que arquivar (veículos, motoristas, parceiros, campanhas) aparece aqui.</p>
                        </div>
                    ) : (
                        sections.map((section) => {
                            const items = data[section.key];
                            if (items.length === 0) return null;
                            const Icon = section.icon;
                            return (
                                <div key={section.key} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-primary" />
                                            <h3 className="font-black text-zinc-800 dark:text-zinc-100">{section.label}</h3>
                                            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
                                        </div>
                                        <a href={section.manageHref} className="text-xs font-bold text-primary hover:underline">Gerir / Restaurar →</a>
                                    </div>
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {items.map((item) => (
                                            <div key={item.id} className="px-6 py-3 flex items-center justify-between text-sm">
                                                <span className="font-semibold text-zinc-700 dark:text-zinc-200">{item.title}</span>
                                                {item.subtitle && <span className="text-zinc-400 text-xs">{item.subtitle}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </PageShell>
        </div>
    );
}
