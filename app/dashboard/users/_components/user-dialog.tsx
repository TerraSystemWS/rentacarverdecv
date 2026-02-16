"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface UserDialogProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function UserDialog({
    isOpen,
    title,
    onClose,
    children,
}: UserDialogProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
