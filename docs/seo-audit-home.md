# Auditoría SEO: Página Home (Inicio)

## 1. ESTRUCTURA DE ENCABEZADOS
La página presenta una estructura de encabezados rica y bien jerarquizada, utilizando tanto encabezados visuales como un bloque semántico oculto específico para LLMs.

### H1: Principal
- **Texto exacto:** "Hotel Familiar en Loja" (Visual) / "Hotel El Cardenal - Su Hogar Familiar en Loja, Ecuador" (Oculto)
- **Cantidad:** 2 (Uno visual para el usuario, uno técnico para SEO/LLM).
- **Ubicación:** Sección Hero y bloque técnico al final del `HomePage`.

### H2: Secciones Principales
- "El encanto de un hotel con alma" (Sección Propuesta)
- "Experiencia y Hospitalidad: El Hotel Familiar en Loja con Todo Incluido" (Sección Amenidades)
- "Habitaciones y Alojamiento en Loja: Descanso Íntimo junto a la Naturaleza" (Sección Habitaciones)
- "4.7 Estrellas de Calidez: Lo que nos hace únicos en Loja" (Sección Confianza)
- "Explore Loja desde el Corazón de la Tradición" (Sección Turismo/Gastronomía)
- "Experiencia del Huésped: Preguntas Frecuentes sobre su Estancia" (Sección FAQ)
- "¿Por qué elegir Hotel El Cardenal?" (Bloque Oculto)
- "Nuestras Habitaciones en Loja" (Bloque Oculto)

### H3-H6: Subsecciones y Detalles
- **H3:** "La Esencia de Antaño", "Mucho más que un Servicio", "Equilibrio Perfecto" (Propuesta)
- **H3:** "HOSPEDAJE", "RESTAURANTE", "EVENTOS" (Amenidades)
- **H3:** "Familiar Loft", "Triple", "Doble Twin", "Matrimonial" (Habitaciones)
- **H3:** "Guía Local: Lo que no se puede perder" (Turismo)
- **H4:** Preguntas de la sección FAQ.
- **H4:** Nombres de atracciones turísticas locales.

- **Análisis de jerarquía:** La estructura es **excelente**. Sigue una progresión lógica desde el H1 (identidad central) hasta H2 (secciones de valor) y H3/H4 (detalles específicos). El uso de palabras clave en los encabezados es estratégico.

---

## 2. METADATOS
- **Title tag:** "Hotel El Cardenal Loja | Hotel Familiar con Desayuno Incluido" (74 caracteres).
- **Meta description:** "Bienvenidos al Hotel El Cardenal en Loja, Ecuador. Disfrute de un ambiente familiar, desayuno tradicional, parqueadero privado y una ubicación privilegiada junto al Parque La Tebaida. ¡Reserve su descanso hoy!" (213 caracteres). ⚠️ *Nota: Es un poco larga, se recomienda reducir a 155-160.*
- **Meta keywords:** `['hotel en loja', 'hotel familiar loja', 'hospedaje loja', 'desayuno incluido loja', 'hotel cerca parque la tebaida', 'hotel seguro loja']`
- **Open Graph tags:**
    - `og:title`: "Hotel Cardenal Loja - Elegancia y Confort"
    - `og:description`: "Descubra la hospitalidad lojana en un ambiente familiar y elegante. Su hogar en Loja le espera."
    - `og:image`: `/Logo.png`
    - `og:url`: `https://hotelelcardenalloja.com`
- **Twitter Cards:** `summary_large_image` configurado.
- **Canonical URL:** `https://hotelelcardenalloja.com` (Correcto).

---

## 3. INTENCIÓN DE BÚSQUEDA
- **Cubierta:** **Navegacional, Informacional y Comercial.**
- **Análisis:** La página satisface al usuario que ya conoce la marca (Navegacional), al que busca "hoteles en Loja" (Comercial) y al que busca "qué hacer en el parque La Tebaida" o "dónde desayunar en Loja" (Informacional).

---

## 4. PALABRAS CLAVE
- **Palabra clave principal:** "Hotel Familiar en Loja"
- **Palabras clave secundarias:** "Alojamiento en Loja", "Hotel con desayuno incluido", "Hospedaje seguro Loja", "Hotel cerca Parque La Tebaida".
- **Densidad:** El término "Loja" y "Hotel" aparecen con alta frecuencia de forma natural. Los primeros 100 caracteres del bloque técnico contienen los términos clave principales.
- **LSI keywords:** "Naturaleza", "tradición", "tradicional", "descanso", "exclusivo", "tranquilidad".

---

## 5. SCHEMA MARKUP / DATOS ESTRUCTURADOS
- **FAQPage:** Implementado correctamente en el componente `FAQ.tsx`.
- **LocalBusiness / Hotel:** ❌ **No detectado.**
- **Validación:** Se recomienda implementar un esquema de `Hotel` u `Organization` en el `layout.tsx` o `page.tsx` para mejorar la visibilidad en Google Maps y fragmentos enriquecidos de búsqueda local.

---

## 6. OPTIMIZACIÓN ON-PAGE
- **URLs:** `/` SEO-friendly por defecto.
- **Imágenes:**
    - Todos los componentes usan `Next/Image`.
    - Atributos `alt` presentes y descriptivos.
    - `priority` aplicado a la imagen del Hero para mejorar LCP.
- **Links internos:** Enlazan a `/habitaciones`, `/servicios`, `/galeria`, `/contacto` y `/blog`. Flujo de autoridad correcto.
- **Links externos:** Links a redes sociales y Google Reviews con `rel="noopener noreferrer"`.
- **Velocidad de carga:** Uso de componentes del servidor (SSR) para el contenido base, lo que acelera el tiempo hasta el primer byte (TTFB).

---

## 7. NEXT.JS ESPECÍFICO
- **Metadata API:** Usa la Metadata API de Next.js 13+ (App Router) correctamente.
- **SSR/CSR:** Estructura híbrida excelente. El contenido SEO está en Server Components, mientras que la interactividad (carousels, tabs) está en Client Components.

---

## 8. PROBLEMAS DETECTADOS
1. **Meta Description:** Demasiado larga (213 caracteres). Prioridad: **Media**.
2. **Schema Markup Local:** Falta el esquema `Hotel` / `LocalBusiness`. Prioridad: **Alta**.
3. **OG Image:** Usa un logo genérico en lugar de una foto atractiva del hotel. Prioridad: **Baja**.

---

## 9. RECOMENDACIONES
- **Quick Win:** Reducir la meta descripción a menos de 160 caracteres.
- **Mejora Crítica:** Implementar JSON-LD para `LocalBusiness` o `Hotel` incluyendo dirección, teléfono y rango de precios.
- **Mejora Visual SEO:** Actualizar la imagen de Open Graph por una de la fachada o una habitación premium para aumentar el CTR en redes sociales.
