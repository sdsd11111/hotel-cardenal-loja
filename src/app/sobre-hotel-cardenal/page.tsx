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
                <h1>Sobre Nosotros - Historia del Hotel El Cardenal Loja</h1>
                <p>
                    Descubra los orígenes de una tradición familiar que nació de la fe, la música y el comercio en San Pedro de la Bendita.
                </p>

                <h2>Tradición y Vocación</h2>
                <p>
                    Desde 1917, Ramón Agustín Ojeda Alvarado inició una destacada labor comercial y tecnológica, fundando fábricas textiles, procesadoras de cabuya y construyendo la Primera Planta de Luz Eléctrica en el sur del país (1950-1973).
                </p>

                <h2>"El Cardenal" - Fe y Música</h2>
                <p>
                    Su apodo "El Cardenal" nació del fervor popular por su inquebrantable fe en la Virgen de El Cisne y su labor como Maestro de Capilla. Su legado musical incluye himnos, pasillos y valses que perduran hasta hoy.
                </p>
                <p>
                    Actualmente, el Hotel El Cardenal es dirigido por la tercera generación de la familia, manteniendo vivos los valores de excelencia y tradición.
                </p>
            </div>
        </>
    );
}
