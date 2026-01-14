"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface PayPhoneBoxProps {
    amount: number; // En dólares (ej: 10.50)
    description: string;
}

declare global {
    interface Window {
        PPaymentButtonBox: any;
    }
}

export default function PayPhoneBox({ amount, description }: PayPhoneBoxProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const containerId = "pp-button";

    useEffect(() => {
        const initPayPhone = () => {
            if (window.PPaymentButtonBox && isLoaded) {
                // Limpiar contenedor por si acaso
                const container = document.getElementById(containerId);
                if (container) container.innerHTML = '';

                const amountInCents = Math.round(amount * 100);
                const transactionId = `hotel-${Date.now().toString().slice(-10)}`;

                const ppb = new window.PPaymentButtonBox({
                    token: process.env.NEXT_PUBLIC_PAYPHONE_TOKEN,
                    integrationType: "web",
                    clientTransactionId: transactionId,
                    amount: amountInCents,
                    amountWithoutTax: amountInCents,
                    currency: "USD",
                    storeId: process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID,
                    reference: description.substring(0, 50),
                    lang: "es"
                });

                ppb.render(containerId);
            }
        };

        initPayPhone();
    }, [isLoaded, amount, description]);

    return (
        <div className="w-full payphone-wrapper">
            <link
                rel="stylesheet"
                href="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css"
            />
            <style jsx global>{`
                .payphone-wrapper * {
                    border-radius: 8px !important;
                }
            `}</style>
            <Script
                src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"
                onLoad={() => setIsLoaded(true)}
            />
            <div id={containerId} className="flex justify-center min-h-[60px]" />
        </div>
    );
}
