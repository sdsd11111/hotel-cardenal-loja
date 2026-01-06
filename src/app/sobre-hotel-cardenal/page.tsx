import { Metadata } from 'next';
import SobreNosotrosClient from './SobreNosotrosClient';

export const metadata: Metadata = {
    title: 'Sobre Nosotros | Hotel El Cardenal Loja - Historia y Tradición',
    description: 'Conozca la historia del Hotel El Cardenal en Loja y el legado de Ramón Agustín Ojeda Alvarado. Tradición, música y hospitalidad lojana en un ambiente familiar.',
    keywords: [
        'historia hotel el cardenal',
        'Ramón Agustín Ojeda Alvarado',
        'hotel el cardenal loja historia',
        'tradicion lojana',
        'hotel cardenal loja sobre nosotros',
        'El Cardenal Loja'
    ],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/sobre-hotel-cardenal',
    }
};

export default function SobreNosotrosPage() {
    return (
        <>
            {/* 🚀 Visual Interactive Component */}
            <SobreNosotrosClient />

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
                <h1>Orígenes de El Cardenal - Historia del Hotel El Cardenal Loja</h1>
                <p>
                    Desde la aparición de la Virgen de El Cisne el 12 de octubre de 1594, da inicio a las caminatas a la población de El Cisne, los peregrinos marcados por la fe y devoción a la Santísima Virgen hacen peregrinaciones a este lugar.
                </p>
                <p>
                    En 1829 después de haber visitado El Cisne, Simón Bolívar promulgó desde Guayaquil el Decreto que oficializaba el desarrollo de la feria de Loja y la romería del Cisne a la Loja, autorizando que cada año se traslade a la Imagen de la Santísima Virgen de El Cisne a Loja.
                </p>

                <h2>Ramón Agustín Ojeda Alvarado - "El Cardenal"</h2>
                <p>
                    Nacido en San Pedro de la Bendita el 18 de diciembre de 1902, Ramón Agustín Ojeda Alvarado fue un hombre autodidacta con profunda labor musical y un hombre público. Su fe en la Santísima Virgen María en la Advocación de El Cisne marcó su vida y obra.
                </p>
                <p>
                    Fue apodado "El Cardenal" por todos sus esfuerzos en mantener viva la fe en la Santísima Virgen María. Su legado musical y empresarial trascendió en su familia de generación en generación.
                </p>

                <h3>Obra Musical y Legado</h3>
                <p>
                    Entre sus composiciones musicales están el "Himno a San Pedro de la Bendita", valses como "Melodías Nativas", pasillos como "Corazón Nostálgico", y varios pasodobles, chilenas y villancicos.
                </p>
                <p>
                    Además de su labor musical, desarrolló una intensa actividad en los negocios e infraestructura local, como la instalación de la primera planta de luz eléctrica en San Pedro de la Bendita.
                </p>

                <h2>Lo que hace diferente al Hotel El Cardenal</h2>
                <p>
                    En el Cardenal en Loja, encuentras una fusión única de historia, naturaleza, modernidad y buen servicio personalizado. Destacamos nuestros jardines y senderos junto al rio Malacatos, nuestra ubicación cerca a centros comerciales y la distinción de nuestras habitaciones clásicas y modernas en un ambiente histórico restaurado con elegancia.
                </p>
                <ul>
                    <li><strong>Historia Viva:</strong> Antigua residencia del siglo XVIII que conserva muebles originales.</li>
                    <li><strong>Jardines y Parques:</strong> Oasis interior con vegetación, fuentes y terraza chill-out.</li>
                    <li><strong>Ubicación Privilegiada:</strong> Dentro del parque La Tebaida, cerca al Parque Podocarpus y al C.C. La Pradera.</li>
                    <li><strong>Habitaciones con Carácter:</strong> Decoración con encanto clásico en un edificio restaurado.</li>
                    <li><strong>Atmósfera Única:</strong> Ambiente relajado y tradicional que contrasta con el bullicio de la ciudad.</li>
                </ul>
                <p>
                    En resumen, hotel El Cardenal le ofrece una estancia histórica en un entorno único que combina jardines y arquitectura tradicional, todo dentro del parque La Tebaida.
                </p>
            </div>
        </>
    );
}
