# Auditoría SEO: Sección de Servicios (General, Restaurante, Eventos)

## 1. ESTRUCTURA DE ENCABEZADOS
La sección de servicios está excepcionalmente bien estructurada, con una jerarquía profunda que cubre tanto beneficios generales como específicos.

### Listado General (`/servicios`)
- **H1:** "Servicios de Excelencia: Su Hogar en Loja"
- **H2-H3:** Bien distribuidos entre Gastronomía, Seguridad y Conectividad.
- **Análisis:** Uso correcto de encabezados visuales y bloques ocultos para reforzar palabras clave locales.

### Restaurante (`/servicios/restaurante`)
- **H1:** "Restaurante en Loja: Sabores Tradicionales y Café de Altura"
- **H2:** "El Desayuno: Nuestra Especialidad", "Ambiente Neoclásico".
- **Análisis:** Muy enfocado en términos de búsqueda específicos como "Café Lojano" y "Desayuno tradicional".

### Eventos (`/servicios/eventos`)
- **H1:** "Eventos y Reuniones en Loja: Exclusividad y Elegancia"
- **H2:** "Espacios Boutique", "Servicios Corporativos".
- **Análisis:** Posicionamiento inteligente como lugar para "eventos pequeños" y "reuniones íntimas", evitando competir con grandes centros de convenciones.

---

## 2. METADATOS
- **Title Tags:** Altamente optimizados (ej: "Servicios Hotel El Cardenal Loja | Desayuno, Parking y WiFi").
- **Keywords:** Excelente selección orientada a servicios de valor (Pet Friendly, Parking, WiFi Negocios).
- **Canonicals:** Correctamente implementados en todas las páginas.

---

## 3. INTENCIÓN DE BÚSQUEDA
- **Cubierta:** **Comercial / Transaccional.**
- **Análisis:** Responde a usuarios que comparan hoteles por sus servicios adicionales. La página de Restaurante también captura búsquedas de gastronomía local.

---

## 4. PALABRAS CLAVE
- **Estrategia:** Beneficios y Conveniencia.
- **Términos fuertes:** "Hotel con parqueadero en Loja", "Hotel Pet Friendly Loja", "Café lojano de especialidad".

---

## 5. SCHEMA MARKUP / DATOS ESTRUCTURADOS
- **Detectado:** Ninguno.
- **Faltante:**
    - `Service` (Generales).
    - `Restaurant` (En la página de restaurante).
    - `EventVenue` (En la página de eventos).
- **Impacto:** Grave. Google no puede categorizar la propiedad como un lugar de eventos o un restaurante formal sin estos esquemas.

---

## 6. OPTIMIZACIÓN ON-PAGE
- **Imágenes:**
    - Uso consistente de `ImageLightbox`.
    - Alts presentes y descriptivos.
- **UX:** Los botones de "Ver Habitaciones" al final de cada servicio son excelentes para guiar al usuario hacia la reserva.

---

## 7. NEXT.JS ESPECÍFICO
- Implementación de `Metadata` estática en Server Components.
- Buena modularización de componentes visuales.

---

## 8. PROBLEMAS DETECTADOS
1. **Falta de Structured Data Diversificado:** Ausencia de esquemas específicos para Restaurante y Salón de Eventos. Prioridad: **Alta**.
2. **Imágenes de Galería de Eventos:** Los nombres de archivo son genéricos (`galeria-1.webp`). Prioridad: **Baja**.

---

## 9. RECOMENDACIONES
- **Mejora Crítica:** Implementar SCHEMA `Restaurant` con menú y horarios, y SCHEMA `EventVenue` con capacidad de personas.
- **SEO Local:** Registrar la sección de restaurante y eventos como servicios destacados en el perfil de Google Business Profile para fortalecer el SEO local.
- **Internal Linking:** Asegurarse de que el Blog enlace a estas páginas cuando se hable de "Qué comer en Loja" o "Dónde hacer reuniones".
