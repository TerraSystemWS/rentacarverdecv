"use client";

import { useState } from "react";
import UserDialog from "./user-dialog";
import ClientForm from "./client-form";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { UserRow } from "@/lib/api/types";

// Usado em Utilizadores e no formulário de nova reserva ("cliente não está na lista").
export default function CreateClientDialog({
    isOpen,
    onClose,
    onCreated,
}: {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (user: UserRow) => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: Record<string, string | null>) => {
        setIsSubmitting(true);
        try {
            const created = await apiFetch<UserRow>(endpoints.users.createClient, {
                method: "POST",
                body: JSON.stringify(data),
            });
            onCreated(created);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <UserDialog isOpen={isOpen} onClose={onClose} title="Novo cliente" wide>
            <ClientForm onSubmit={handleSubmit} onCancel={onClose} isSubmitting={isSubmitting} />
        </UserDialog>
    );
}
