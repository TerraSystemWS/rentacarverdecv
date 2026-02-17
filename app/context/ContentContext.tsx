"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";

interface SiteContent {
    about: {
        headerTitle: string;
        headerDesc: string;
        mainTitle: string;
        mainSubtitle: string;
        bigTitle: string;
        p1: string;
        p2: string;
    };
    contact: {
        headerTitle: string;
        headerSubtitle: string;
        directTitle: string;
        address: string;
        phone: string;
        email: string;
        mapTitle: string;
        mapSubtitle: string;
        mapDesc: string;
    };
    home: {
        app: {
            topSubtitle: string;
            title: string;
            subtitle: string;
        };
        funFacts: {
            f1: string;
            f1Num: number | string;
            f2: string;
            f2Num: number | string;
            f3: string;
            f3Num: number | string;
            f4: string;
            f4Num: number | string;
        };
    };
    settings: {
        maintenanceMode: number;
    };
}

interface ContentContextType {
    content: SiteContent | null;
    loading: boolean;
    refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshContent = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}${endpoints.content.public}`);
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
        refreshContent();
    }, []);

    return (
        <ContentContext.Provider value={{ content, loading, refreshContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error("useContent must be used within a ContentProvider");
    }
    return context;
};
