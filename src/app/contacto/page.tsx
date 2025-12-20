import { Metadata } from 'next';
import ContactoClient from './ContactoClient';

export const metadata: Metadata = {
    title: 'Contacto | Hotel El Cardenal Loja - Reservas y Consultas',
    description: 'Póngase en contacto con Hotel El Cardenal en Loja. Realice sus reservas, consultas sobre eventos corporativos, tarifas de grupos o servicios exclusivos. Estamos para servirle.',
    keywords: ['contacto hotel loja', 'reservas hotel loja', 'hotel el cardenal contacto', 'teléfono hotel loja', 'dirección hotel el cardenal'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/contacto',
    }
};

export default function ContactoPage() {
    return (
        <>
            {/* 🚀 Visual Interactive Component */}
            <ContactoClient />

            {/* 🤖 LLM & SEO Hidden Content */}
            <div
                style={{
                    position: 'absolute',
                    left: '-10000px',
                    top: 'auto',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }}
                aria-hidden="true"
            >
                <h1>Contacto y Reservas - Hotel El Cardenal Loja</h1>
                <p>
                    Estamos listos para recibirle en Loja, Ecuador. Hotel El Cardenal le ofrece múltiples canales de atención
                    para facilitar su reserva y resolver cualquier duda sobre su próxima estancia con nosotros.
                </p>

                <h2>Información de Contacto Directo</h2>
                <ul>
                    <li><strong>Teléfono y WhatsApp:</strong> 099 661 6878 (Atención personalizada y rápida).</li>
                    <li><strong>Correo Electrónico:</strong> elcardenalhotel@gmail.com</li>
                    <li><strong>Dirección:</strong> Gladiolos 154-42 y Av. 18 de Noviembre, Sector Los Rosales, Loja, Ecuador.</li>
                    <li><strong>Horario de Recepción:</strong> Disponible las 24 horas, los 7 días de la semana.</li>
                </ul>

                <h2>¿Cómo reservar su habitación?</h2>
                <p>
                    Puede utilizar nuestro formulario en línea para solicitar una reserva. Al completar sus datos,
                    nuestro equipo procesará la solicitud y le enviará un <strong>link de pago seguro</strong> para
                    confirmar su espacio. Aceptamos diversas formas de pago para su comodidad.
                </p>

                <h2>Servicios para Consultas Especiales</h2>
                <ul>
                    <li><strong>Eventos Corporativos:</strong> Contamos con espacios adecuados para reuniones íntimas y de negocios.</li>
                    <li><strong>Tarifas para Grupos:</strong> Ofrecemos descuentos especiales para delegaciones, empresas y grupos familiares grandes.</li>
                    <li><strong>Turismo en Loja:</strong> Brindamos información sobre tours al Parque Nacional Podocarpus, Vilcabamba y más.</li>
                    <li><strong>Mascotas:</strong> Somos un hotel Pet Friendly, consulte las condiciones para viajar con su mascota.</li>
                </ul>

                <h2>Ubicación Estratégica</h2>
                <p>
                    Nos encontramos en el sector Los Rosales, una zona tranquila y residencial junto al Parque La Tebaida.
                    Nuestra ubicación le permite disfrutar de la paz de la naturaleza y el río Malacatos, estando a solo
                    minutos del bullicio comercial del centro de Loja.
                </p>
            </div>
        </>
    );
}
