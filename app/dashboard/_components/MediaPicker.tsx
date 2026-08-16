"use client";

import { useEffect, useState } from "react";
import { X, Search, Check } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { MediaAsset } from "@/lib/api/types";

interface MediaPickerProps {
    isOpen: boolean;
    category?: string;
    onClose: () => void;
    onSelect: (asset: MediaAsset) => void;
}

// Modal para escolher um ficheiro já existente na Media Library em vez de
// forçar sempre um novo upload do disco (tasks.md: "qq parte do site ao
// fazer upload pode escolher pegar da media library ou importar do pc").
export default function MediaPicker({ isOpen, category, onClose, onSelect }: MediaPickerProps) {
    const { authFetch } = useAuth();
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        authFetch(endpoints.media.list(category))
            .then((res) => (res.ok ? res.json() : []))
            .then(setAssets)
            .catch(() => setAssets([]))
            .finally(() => setLoading(false));
    }, [isOpen, category, authFetch]);

    if (!isOpen) return null;

    const getImageSrc = (url: string) => (url.startsWith("/uploads") ? `${API_BASE_URL}${url}` : url);
    const filtered = assets.filter((a) => a.originalFilename.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-lg font-black text-gray-900">Escolher da Media Library</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X size={22} />
                    </button>
                </div>
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
                <div className="p-5 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {loading ? (
                        <div className="col-span-full py-16 text-center text-gray-400 text-sm font-bold">A carregar...</div>
                    ) : filtered.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-gray-400 text-sm font-bold">
                            Sem ficheiros{category ? ` na categoria "${category}"` : ""}. Carregue um novo ficheiro através do formulário.
                        </div>
                    ) : (
                        filtered.map((asset) => (
                            <button
                                key={asset.id}
                                type="button"
                                onClick={() => onSelect(asset)}
                                className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/30 transition-all"
                                title={asset.originalFilename}
                            >
                                <img src={getImageSrc(asset.url)} alt={asset.originalFilename} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/40 transition-colors flex items-center justify-center">
                                    <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
