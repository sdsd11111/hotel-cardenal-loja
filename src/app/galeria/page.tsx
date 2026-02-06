import { Metadata } from 'next';
import GaleriaClient from './GaleriaClient';

export const metadata: Metadata = {
    title: 'Galería | Hotel El Cardenal Loja - Explore Nuestras Instalaciones',
    description: 'Vea las imágenes de nuestras elegantes habitaciones, el restaurante de comida tradicional y el hermoso entorno natural del Hotel El Cardenal en Loja.',
    keywords: ['galería hotel loja', 'fotos hotel el cardenal', 'imágenes habitaciones loja', 'hotel neoclásico loja', 'parque la tebaida fotos'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/galeria',
    }
};

export default function GalleryPage() {
    return (
        <>
            {/* 🚀 Visual Interactive Component */}
            <GaleriaClient />

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
                <h1>Galería Visual - Hotel El Cardenal Loja</h1>
                <p>
                    Explore a través de imágenes la elegancia neoclásica y el entorno natural que nos convierten en el mejor
                    hotel familiar en Loja. Nuestra galería refleja el compromiso con la calidez y la excelencia.
                </p>

                <h2>Nuestras Habitaciones y Suites</h2>
                <p>
                    Descubra el confort de nuestras habitaciones: el amplio Familiar Loft para grupos, nuestras suites matrimoniales
                    románticas y las habitaciones dobles funcionales. Todas con acabados de alta calidad y una limpieza impecable.
                </p>

                <h2>Experiencia Gastronómica y Áreas Sociales</h2>
                <p>
                    Vea nuestro restaurante donde servimos el mejor desayuno tradicional de Loja. Admire nuestra arquitectura
                    con detalles de piedra volcánica, madera tallada y muebles Zuleta que dan un toque de historia y distinción.
                </p>

                <h2>Entorno Natural en Loja</h2>
                <p>
                    Nuestra ubicación junto al Parque Lineal La Tebaida y el río Malacatos ofrece vistas relajantes y un aire puro
                    inigualable. Explore la vitalidad de la naturaleza sin salir de la ciudad.
                </p>

                <h2>Momentos de Nuestros Huéspedes</h2>
                <p>
                    Compartimos capturas reales de nuestros visitantes, mostrando la experiencia auténtica de hospedarse en
                    Hotel El Cardenal, desde momentos de descanso hasta desayunos compartidos.
                </p>
            </div>
            {/* 📊 Structured Data (JSON-LD) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ImageGallery",
                        "name": "Galería de Fotos - Hotel El Cardenal Loja",
                        "description": "Explora nuestras instalaciones, habitaciones neoclásicas, restaurante tradicional y el entorno natural del Parque La Tebaida en Loja.",
                        "url": "https://hotelelcardenalloja.com/galeria",
                        "image": "https://hotelelcardenalloja.com/logo.png"
                    })
                }}
            />
        </>
    );
}
