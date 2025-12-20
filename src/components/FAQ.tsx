'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

// FAQ data with SEO keywords
const faqs = [
    {
        id: 1,
        pregunta: '¿Cuál es la ubicación del Hotel El Cardenal en Loja?',
        respuesta: 'Estamos ubicados en la calle Gladiolos y Av. 18 de Noviembre, en la tranquila Urbanización Los Rosales. Nuestra ubicación es estratégica: a solo 7 minutos a pie del Supermaxi y el C.C. La Pradera, y a pasos del Parque Lineal La Tebaida. Es el lugar ideal para quienes buscan un hotel en Loja cerca de la naturaleza pero con fácil acceso al centro histórico (a 10 minutos).'
    },
    {
        id: 2,
        pregunta: '¿El hotel cuenta con parqueadero privado y seguro?',
        respuesta: 'Sí, ofrecemos parqueadero gratuito y privado dentro de nuestras instalaciones para todos nuestros huéspedes. Sabemos que la seguridad de su vehículo es prioridad, por lo que nuestras áreas están vigiladas para su total tranquilidad durante su hospedaje en Loja.'
    },
    {
        id: 3,
        pregunta: '¿Qué incluye el desayuno en el Hotel El Cardenal?',
        respuesta: 'Todas nuestras tarifas incluyen un desayuno casero y tradicional. Nos enorgullece servir café lojano de altura acompañado de delicias locales como tamales o humitas, garantizando que comience su día con el auténtico sabor de nuestra tierra.'
    },
    {
        id: 4,
        pregunta: '¿Es un hotel adecuado para familias y niños?',
        respuesta: 'Absolutamente. Somos el hotel familiar en Loja por excelencia. Contamos con habitaciones amplias como nuestro Familiar Loft y estamos junto al Parque La Tebaida, que ofrece 3.5 km de senderos ecológicos y áreas recreativas ideales para que los niños disfruten del aire puro.'
    },
    {
        id: 5,
        pregunta: '¿Tienen conexión WiFi para teletrabajo?',
        respuesta: 'Sí, disponemos de WiFi de alta velocidad gratuito en todas las habitaciones y áreas sociales. Con una puntuación de 9.5/10 en conectividad, somos una opción confiable para viajeros de negocios que necesitan un alojamiento en Loja estable y tranquilo.'
    },
    {
        id: 6,
        pregunta: '¿Cómo puedo realizar una reserva directa?',
        respuesta: 'Puede reservar directamente a través de nuestra página web oficial o contactarnos por WhatsApp. Al ser un hotel íntimo de solo 6 habitaciones, recomendamos reservar con anticipación, especialmente durante el Festival de Artes Vivas o feriados.'
    },
    {
        id: 7,
        pregunta: '¿Cómo puedo garantizar mi reserva en el hotel?',
        respuesta: 'Para asegurar su habitación, el hotel puede solicitar una garantía mediante tarjeta de crédito o un depósito anticipado. Esto nos permite mantener su cupo bloqueado y ofrecerle una recepción ágil a su llegada.'
    },
    {
        id: 8,
        pregunta: '¿Puedo pagar mi estancia al momento de llegar?',
        respuesta: 'Sí, puede liquidar su estancia al momento del check-in. Sin embargo, recomendamos realizar el pago anticipado o registro de tarjeta para garantizar la disponibilidad, especialmente en temporadas de alta demanda o eventos en Loja.'
    },
    {
        id: 9,
        pregunta: '¿Emiten factura comercial para empresas o extranjeros?',
        respuesta: 'Sí. Somos un establecimiento formalmente registrado. Al momento de su reserva o ingreso, puede proporcionarnos sus datos de facturación (RUC, Cédula o Pasaporte) y emitiremos el comprobante correspondiente para sus registros contables o de viaje.'
    }
];

// Generate JSON-LD Schema for FAQPage
const generateFAQSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.pregunta,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.respuesta
            }
        }))
    };
};

export const FAQ = () => {
    const [openId, setOpenId] = useState<number | null>(null); // Closed by default

    const toggleFAQ = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="py-24 bg-[#F8F9F7] relative">
            {/* JSON-LD Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema()) }}
            />

            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <HelpCircle className="w-6 h-6 text-cardenal-gold" />
                        <span className="text-cardenal-gold font-bold text-xs uppercase tracking-[0.3em] font-serif">
                            FAQ
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-6 font-serif leading-tight">
                        Experiencia del Huésped: <span className="text-cardenal-gold italic">Preguntas Frecuentes</span> sobre su Estancia
                    </h2>
                    <h3 className="text-lg md:text-xl text-text-muted font-medium leading-relaxed">
                        Resolvemos sus dudas para que su visita al Hotel El Cardenal sea perfecta.
                    </h3>
                    <div className="w-24 h-1.5 bg-cardenal-gold mx-auto mt-8"></div>
                </div>

                {/* Accordion FAQ */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className={`bg-white shadow-md hover:shadow-lg transition-all duration-500 border ${openId === faq.id ? 'border-cardenal-gold' : 'border-transparent'}`}
                        >
                            <button
                                onClick={() => toggleFAQ(faq.id)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
                                aria-expanded={openId === faq.id}
                            >
                                <h4 className={`text-lg md:text-xl font-bold font-serif pr-4 transition-colors ${openId === faq.id ? 'text-cardenal-green' : 'text-cardenal-green/80 group-hover:text-cardenal-green'}`}>
                                    {faq.pregunta}
                                </h4>
                                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all duration-300 ${openId === faq.id ? 'bg-cardenal-gold text-white rotate-180' : 'bg-cardenal-gold/10 text-cardenal-gold group-hover:bg-cardenal-gold group-hover:text-white'}`}>
                                    {openId === faq.id ? (
                                        <Minus className="w-5 h-5" />
                                    ) : (
                                        <Plus className="w-5 h-5" />
                                    )}
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 md:px-8 pb-6 md:pb-8">
                                    <div className="h-px bg-cardenal-gold/20 mb-6"></div>
                                    <p className="text-text-main leading-relaxed text-base md:text-lg">
                                        {faq.respuesta}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Help CTA */}
                <div className="text-center mt-16">
                    <p className="text-text-muted mb-4">¿Tiene más preguntas?</p>
                    <a
                        href="https://wa.me/593939790561?text=Hola,%20tengo%20una%20consulta%20sobre%20el%20Hotel%20El%20Cardenal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-cardenal-green hover:text-cardenal-gold font-bold transition-colors font-serif"
                    >
                        Contáctenos por WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
};
