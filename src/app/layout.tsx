import type { Metadata } from "next";
import { Playfair_Display, Inter, Cinzel, Allura, Libre_Baskerville, Montserrat, Cormorant_Garamond, Lato, Outfit } from "next/font/google";
import "./globals.css";
import { FontAwesomeProvider } from "./providers";
import GoogleTranslateWrapper from "@/components/GoogleTranslateWrapper";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
});
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: 'swap',
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  display: 'swap',
});
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

const libre = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hotelelcardenalloja.com'),
  title: "Hotel Familiar en Loja | Desayuno Incluido | Hotel El Cardenal",
  description: "Disfrute de un hotel familiar en Loja con desayuno incluido, parking gratis y cerca de la naturaleza. Reserve en Hotel El Cardenal, su hogar íntimo en Loja.",
  keywords: ["Hotel Familiar en Loja", "Desayuno Incluido", "Cerca de la Naturaleza", "Alojamiento en Loja", "Hotel El Cardenal", "Loja", "Ecuador", "Hospedaje", "Turismo Loja"],
  authors: [{ name: "Hotel Cardenal Loja" }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "Hotel Cardenal Loja - Elegancia y Confort",
    description: "Descubra la hospitalidad lojana en un ambiente familiar y elegante. Su hogar en Loja le espera.",
    url: 'https://hotelelcardenalloja.com',
    siteName: 'Hotel El Cardenal Loja',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Hotel Cardenal Loja',
      },
    ],
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Hotel Cardenal Loja - Elegancia y Confort",
    description: "El hotel preferido en el centro de Loja.",
    images: ['/logo.png'],
  },
  verification: {
    google: 'b8aT21-LZNETjhU4bA6PX_7tV-OQ941E5SpXG_7NFpw',
  },
  other: {
    'dns-prefetch': ['https://fonts.gstatic.com', 'https://translate.googleapis.com'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://translate.googleapis.com" />
        <link rel="preconnect" href="https://www.gstatic.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body className={`${cormorantGaramond.variable} ${lato.variable} ${playfairDisplay.variable} ${outfit.variable} ${inter.variable} ${cinzel.variable} ${allura.variable} ${libre.variable} ${montserrat.variable} antialiased bg-cardenal-cream text-text-main flex flex-col min-h-screen font-sans`}>
        <FontAwesomeProvider>
          <LoadingScreen />
          <div className="flex flex-col flex-1">
            {children}
            <GoogleTranslateWrapper />
          </div>
        </FontAwesomeProvider>
      </body>
    </html>
  );
}
