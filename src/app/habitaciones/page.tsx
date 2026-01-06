import { Metadata } from 'next';
import HabitacionesPageClient from './HabitacionesClient';

export const metadata: Metadata = {
    title: 'Habitaciones | Hotel El Cardenal Loja - Confort y Descanso',
    description: 'Explore nuestras 6 exclusivas habitaciones en Loja: Triple, Doble Twin y Matrimonial. El mejor hospedaje familiar junto al río Malacatos.',
    keywords: ['hotel familiar en Loja', 'habitaciones Loja', 'hospedaje Loja', 'Hotel El Cardenal', 'confort', 'descanso', 'sector Los Rosales']
};

export default function HabitacionesPage() {
    return (
        <>
            {/* 🚀 Visual Interactive Component */}
            <HabitacionesPageClient />

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
                <h1>Nuestras Habitaciones - Hotel El Cardenal Loja</h1>
                <p>
                    Ofrecemos 6 exclusivas habitaciones diseñadas para brindar el máximo confort y descanso en el sector
                    más tranquilo de Loja. Todas nuestras habitaciones incluyen desayuno tradicional, parqueadero privado,
                    WiFi de alta velocidad, TV por cable y baño privado con agua caliente.
                </p>

                <h2>Opciones de Alojamiento</h2>


                <h3>Habitación Triple (3 Camas)</h3>
                <p>
                    Espaciosa y luminosa, perfecta para grupos de amigos o familias pequeñas.
                    Ambiente neoclásico con vistas relajantes.
                    Precio estimado: $75.00 USD por noche.
                </p>

                <h3>Habitación Doble Twin (2 Camas)</h3>
                <p>
                    Ideal para viajes de negocios o turismo compartido. Equipada con dos camas de plaza y media
                    y acabados elegantes en madera y piedra.
                    Precio estimado: $55.00 USD por noche.
                </p>

                <h3>Habitación Matrimonial (1 Cama)</h3>
                <p>
                    El refugio perfecto para parejas. Ambiente romántico, tranquilo y acogedor para una estancia inolvidable.
                    Precio estimado: $45.00 USD por noche.
                </p>

                <h2>Beneficios Incluidos en su Estancia</h2>
                <ul>
                    <li>Desayuno continental/tradicional lojano incluido cada mañana.</li>
                    <li>Parqueadero privado y seguro dentro de las instalaciones.</li>
                    <li>Ubicación privilegiada junto al Parque La Tebaida y el río Malacatos.</li>
                    <li>Sector residencial seguro y estratégico, alejado del ruido del tráfico.</li>
                    <li>Trato humano y hospitalidad familiar garantizada.</li>
                </ul>
            </div>
        </>
    );
}
