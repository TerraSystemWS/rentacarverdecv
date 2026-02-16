"use client";

import { Advertisement } from "@/lib/api/types";
import AdForm from "./ad-form";
import { X } from "lucide-react";

interface AdDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Advertisement, image?: File) => void;
    initialData?: Partial<Advertisement>;
    isSubmitting?: boolean;
    title: string;
}

export default function AdDialog({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting,
    title,
}: AdDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center duration-300">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
                        <p className="text-gray-500 text-sm mt-1">Preencha os dados do anúncio abaixo.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-2xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-95"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <AdForm
                        initialData={initialData}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
