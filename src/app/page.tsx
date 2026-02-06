import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Hotel El Cardenal Loja | Hotel Familiar con Desayuno Incluido',
  description: 'Bienvenidos al Hotel El Cardenal en Loja, Ecuador. Disfrute de un ambiente familiar, desayuno tradicional, parqueadero privado y una ubicación privilegiada junto al Parque La Tebaida. ¡Reserve su descanso hoy!',
  keywords: ['hotel en loja', 'hotel familiar loja', 'hospedaje loja', 'desayuno incluido loja', 'hotel cerca parque la tebaida', 'hotel seguro loja'],
  alternates: {
    canonical: 'https://hotelelcardenalloja.com',
  }
};

export default function HomePage() {
  return (
    <>
      {/* 🚀 Visual Interactive Component */}
      <HomeClient />

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
        <h1>Hotel El Cardenal - Su Hogar Familiar en Loja, Ecuador</h1>
        <p>
          En Hotel El Cardenal le ofrecemos una estancia acogedora y segura en el sector más tranquilo de la ciudad de Loja.
          Disfrute de la comodidad de nuestras 6 exclusivas habitaciones, parqueadero privado gratuito y la paz de estar
          estratégicamente ubicados junto al Parque Lineal La Tebaida y el río Malacatos.
        </p>

        <h2>¿Por qué elegir Hotel El Cardenal?</h2>
        <ul>
          <li><strong>Ubicación Privilegiada:</strong> Situados en el sector Los Rosales, un área residencial de alta plusvalía, libre de ruidos del centro pero a pocos minutos de los principales puntos de interés.</li>
          <li><strong>Desayuno Tradicional Incluido:</strong> Comience su día con el auténtico sabor de Loja, preparado con ingredientes frescos y el toque casero que nos caracteriza.</li>
          <li><strong>Seguridad y Confort:</strong> Contamos con parqueadero privado, ambientes elegantes con acabados de madera y piedra volcánica, y un trato humano excepcional.</li>
          <li><strong>Cercanía a la Naturaleza:</strong> Pasee por los senderos del Parque La Tebaida o disfrute de las vistas al río directamente desde nuestras instalaciones.</li>
        </ul>

        <h2>Nuestras Habitaciones en Loja</h2>
        <p>Ofrecemos opciones para cada tipo de viajero, todas equipadas con WiFi de alta velocidad, TV por cable y baño privado:</p>
        <ul>
          <li><strong>Habitación Triple:</strong> Perfecta para viajes de amigos o familias pequeñas, con 3 camas individuales y luz natural.</li>
          <li><strong>Doble Twin:</strong> Equipada con dos camas de plaza y media, ideal para viajes de negocios o turismo compartido.</li>
          <li><strong>Matrimonial:</strong> El refugio perfecto para parejas, con cama de dos plazas y media y un ambiente romántico y tranquilo.</li>
        </ul>

        <h2>Servicios Destacados</h2>
        <ul>
          <li>WiFi de alta velocidad gratuito en todo el hotel.</li>
          <li>Parqueadero privado y seguro bajo techo.</li>
          <li>Restaurante con desayunos típicos y café de altura.</li>
          <li>Espacios para reuniones y eventos íntimos.</li>
          <li>Asistencia turística para explorar Loja y sus alrededores (Vilcabamba, Zamora, etc.).</li>
        </ul>

        <h2>Ubicación y Contacto</h2>
        <p>
          Dirección: Gladiolos 154-42 y Av. 18 de Noviembre (Sector Los Rosales), Loja, Ecuador.
          Teléfono: 099 661 6878
          Email: elcardenalhotel@gmail.com
        </p>
      </div>
      {/* 📊 Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Hotel",
            "name": "Hotel El Cardenal Loja",
            "image": "https://hotelelcardenalloja.com/logo.png",
            "@id": "https://hotelelcardenalloja.com",
            "url": "https://hotelelcardenalloja.com",
            "telephone": "+593996616878",
            "priceRange": "$$",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "9.4",
              "bestRating": "10",
              "reviewCount": "104",
              "ratingExplanation": "Calificación basada en reseñas reales de Booking.com"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Gladiolos 154-42 y Av. 18 de Noviembre",
              "addressLocality": "Loja",
              "addressRegion": "Loja",
              "postalCode": "110101",
              "addressCountry": "EC"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -3.99312,
              "longitude": -79.20456
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            },
            "amenityFeature": [
              {
                "@type": "LocationFeatureSpecification",
                "name": "Free WiFi",
                "value": true
              },
              {
                "@type": "LocationFeatureSpecification",
                "name": "Free Parking",
                "value": true
              },
              {
                "@type": "LocationFeatureSpecification",
                "name": "Breakfast Included",
                "value": true
              }
            ]
          })
        }}
      />
    </>
  );
}
