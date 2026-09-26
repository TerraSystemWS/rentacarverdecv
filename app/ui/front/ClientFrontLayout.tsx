"use client";

import { useContent } from "@/app/context/ContentContext";
import { ShieldAlert } from "lucide-react";
import Header from "./minis/Header";
import Footer from "./footer";
import AdPopup from "./AdPopup";

export default function ClientFrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { content, loading } = useContent();

    if (!loading && content?.settings?.maintenanceMode === 1) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mb-8 animate-bounce">
                    <ShieldAlert size={48} />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Estamos em Manutenção</h1>
                <p className="text-xl text-gray-500 max-w-lg mx-auto font-medium leading-relaxed">
                    Voltaremos em breve com novidades. <br />
                    Agradecemos a sua paciência.
                </p>
                <div className="mt-12 pt-8 border-t border-gray-100 w-full max-w-xs">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Rent-A-Car Verde</p>
                </div>
            </div>
        );
    }

    // A página (children) fica SEMPRE na mesma posição da árvore. Antes, durante
    // o carregamento dos conteúdos devolvia-se só <>{children}</> e depois
    // <Header/><main>{children}</main>… — a mudança de posição fazia o React
    // desmontar e montar a página de novo: perdia-se o que o utilizador já
    // tinha feito (ex: formulário preenchido, "subscrição cancelada") e os
    // pedidos iniciais de cada página eram feitos duas vezes.
    return (
        <>
            {!loading && <Header />}
            <main>{children}</main>
            {!loading && <Footer />}
            {!loading && <AdPopup />}
        </>
    );
}
