"use client";

import { useContent } from "@/app/context/ContentContext";
import { ShieldAlert } from "lucide-react";
import Header from "./minis/Header";
import Footer from "./footer";

export default function ClientFrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { content, loading } = useContent();

    if (loading) return <>{children}</>;

    if (content?.settings?.maintenanceMode === 1) {
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

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}
