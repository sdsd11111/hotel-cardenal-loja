'use client';

import { useEffect } from 'react';

interface TabPaymentWidgetProps {
    businessCode: string;
    productId?: string;
    amount?: number;
    customerName?: string;
    customerEmail?: string;
    onSuccess?: (data: any) => void;
    onCancel?: () => void;
    onError?: (error: any) => void;
}

export const TabPaymentWidget = ({
    businessCode,
    productId,
    amount,
    customerName,
    customerEmail,
    onSuccess,
    onCancel,
    onError
}: TabPaymentWidgetProps) => {

    useEffect(() => {
        // Configurar widgetSettings en el objeto window
        (window as any).widgetSettings = {
            businessCode: businessCode,
            baseURL: "https://checkout.tab.travel",
            // Si tenemos un productId específico, lo agregamos
            ...(productId && { business_specific_id: productId })
        };

        // Cargar el script del widget de Tab si no existe
        if (!document.querySelector('script[src="https://checkout.tab.travel/widget.js"]')) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://checkout.tab.travel/widget.js';

            script.onload = () => {
                console.log('✅ Tab widget script loaded successfully');
            };

            script.onerror = () => {
                console.error('❌ Failed to load Tab widget script');
                onError?.({ message: 'Failed to load payment widget' });
            };

            const firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode?.insertBefore(script, firstScript);
        }

        // Escuchar eventos del widget (si Tab los soporta)
        const handleTabPaymentSuccess = (event: CustomEvent) => {
            console.log('✅ Payment successful:', event.detail);
            onSuccess?.(event.detail);
        };

        const handleTabPaymentCancel = (event: CustomEvent) => {
            console.log('⚠️ Payment cancelled:', event.detail);
            onCancel?.();
        };

        const handleTabPaymentError = (event: CustomEvent) => {
            console.error('❌ Payment error:', event.detail);
            onError?.(event.detail);
        };

        window.addEventListener('tab-payment-success' as any, handleTabPaymentSuccess);
        window.addEventListener('tab-payment-cancel' as any, handleTabPaymentCancel);
        window.addEventListener('tab-payment-error' as any, handleTabPaymentError);

        return () => {
            window.removeEventListener('tab-payment-success' as any, handleTabPaymentSuccess);
            window.removeEventListener('tab-payment-cancel' as any, handleTabPaymentCancel);
            window.removeEventListener('tab-payment-error' as any, handleTabPaymentError);
        };
    }, [businessCode, productId, onSuccess, onCancel, onError]);

    return null; // Este componente solo configura el widget, no renderiza nada
};

/**
 * Hook para abrir el widget de Tab programáticamente
 */
export const useTabCheckout = () => {
    const openCheckout = (productId?: string) => {
        // Verificar si el widget está disponible
        if (typeof window !== 'undefined') {
            // Opción 1: Si Tab expone una función global para abrir el checkout
            if ((window as any).TabCheckout && (window as any).TabCheckout.open) {
                (window as any).TabCheckout.open(productId);
            }
            // Opción 2: Redirigir a la URL del producto
            else if (productId) {
                window.location.href = `https://checkout.tab.travel/product/${productId}`;
            }
            // Opción 3: Trigger del botón "Book Now" si existe
            else {
                const bookNowButton = document.querySelector('[data-tab-book-now]');
                if (bookNowButton instanceof HTMLElement) {
                    bookNowButton.click();
                } else {
                    console.warn('⚠️ Tab checkout widget not ready. Make sure the script is loaded.');
                }
            }
        }
    };

    return { openCheckout };
};
