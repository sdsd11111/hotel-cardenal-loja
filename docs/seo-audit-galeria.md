# Auditoría SEO: Página de Galería (`/galeria`)

## 1. ESTRUCTURA DE ENCABEZADOS
La página de galería utiliza una estrategia mixta de contenido visual dinámico y un bloque semántico oculto para asegurar la indexación de todas las facetas del hotel.

### Jerarquía
- **H1:** "Galería Visual: Un Recorrido por el Hotel El Cardenal"
- **H2 (Oculto):** "Nuestras Habitaciones y Suites", "Experiencia Gastronómica", "Entorno Natural".
- **H3 (Oculto):** "Lo que nuestros huéspedes capturan", "¿Le Gusta lo que Ve?".
- **Análisis:** La jerarquía es clara y cubre todas las áreas de negocio. El uso de encabezados invisibles para describir las categorías de fotos es una excelente táctica para "leer" imágenes.

---

## 2. METADATOS
- **Title Tag:** "Galería | Hotel El Cardenal Loja - Explore Nuestras Instalaciones" (65 caracteres). **Excelente.**
- **Meta Description:** "Vea las imágenes de nuestras elegantes habitaciones, el restaurante de comida tradicional y el hermoso entorno natural del Hotel El Cardenal en Loja." **Excelente.**
- **Keywords:** Incluye términos clave como "hotel neoclásico loja" y "parque la tebaida fotos".
- **Canonical:** Correctamente implementado.

---

## 3. INTENCIÓN DE BÚSQUEDA
- **Cubierta:** **Navegacional / Comercial.**
- **Análisis:** El usuario desea validar visualmente la calidad del hotel antes de la reserva. La página cumple esta función al 100%.

---

## 4. PALABRAS CLAVE
- **Estrategia:** Atributos visuales y marca.
- **Análisis:** Refuerza conceptos como "neoclásico", "madera Zuleta" y "limpieza impecable", que son factores de decisión importantes.

---

## 5. SCHEMA MARKUP / DATOS ESTRUCTURADOS
- **Detectado:** Ninguno.
- **Faltante:** `ImageGallery`.
- **Impacto:** Medio. Este esquema ayudaría a Google a mostrar un carrusel de imágenes más rico en los resultados de búsqueda.

---

## 6. OPTIMIZACIÓN ON-PAGE
- **Imágenes (`GalleryGrid`):**
    - **ALTS:** ⚠️ **PUNTUACIÓN MÁXIMA.** Los atributos `alt` son altamente descriptivos (ej: "Familiar Loft: Espacio en Dos Niveles", "Café de Altura: Aroma Inigualable"). Esto es oro puro para Google Imágenes.
    - **Carga:** Utiliza `loading="lazy"` para no penalizar la velocidad de carga inicial (LCP).
- **UX:** El lightbox permite una visualización en pantalla completa, aumentando el tiempo de permanencia en página.

---

## 7. NEXT.JS ESPECÍFICO
- `unoptimized` flag en imágenes: Se recomienda revisar si es posible usar la optimización nativa de Next.js para mejorar el Web Vitals.

---

## 8. PROBLEMAS DETECTADOS
1. **Falta de Schema `ImageGallery`:** Oportunidad perdida de datos estructurados. Prioridad: **Media**.
2. **Uso de `unoptimized`:** Podría impactar ligeramente en el rendimiento móvil si las imágenes son muy pesadas. Prioridad: **Baja**.

---

## 9. RECOMENDACIONES
- **Mejora Crítica:** Implementar SCHEMA `ImageGallery` que envuelva la lista de imágenes.
- **Performance:** Ejecutar un script de compresión para asegurar que todas las imágenes en `/images/galeria/` pesen menos de 200KB sin perder fidelidad visual.
- **Engagement:** Añadir botones de "Compartir en Pinterest" a cada imagen del lightbox; esta es una red social visual potente para el turismo.
