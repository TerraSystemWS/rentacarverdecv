"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";

export default function PaymentPage() {
    const params = useParams();
    const id = params?.id;
    const [paymentData, setPaymentData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!id) return;

        const initPayment = async () => {
            try {
                const responseUrl = `${window.location.origin}${API_BASE_URL}${endpoints.payment.callback}`;
                const res = await fetch(`${API_BASE_URL}${endpoints.payment.init(Number(id), responseUrl)}`);

                if (!res.ok) {
                    throw new Error("Falha ao inicializar o pagamento.");
                }

                const data = await res.json();
                setPaymentData(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Ocorreu um erro ao preparar o pagamento.");
            }
        };

        initPayment();
    }, [id]);

    useEffect(() => {
        if (paymentData && formRef.current) {
            formRef.current.submit();
        }
    }, [paymentData]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Erro de Pagamento</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.href = "/dashboard/bookings"}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Voltar para Reservas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Processando Pagamento...</h2>
                <p className="text-gray-500">Estamos a redirecionar você para o gateway seguro vinti4.</p>
                <p className="text-sm text-gray-400 mt-4">Por favor, não feche esta janela.</p>
            </div>

            {paymentData && (
                <form ref={formRef} action={paymentData.vinti4Url} method="POST" className="hidden">
                    {Object.entries(paymentData).map(([key, value]: [string, any]) => (
                        key !== "vinti4Url" && <input key={key} type="hidden" name={key} value={value} />
                    ))}
                </form>
            )}
        </div>
    );
}
