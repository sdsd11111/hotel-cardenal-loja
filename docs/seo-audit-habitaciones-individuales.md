# Auditoría SEO: Habitaciones Individuales (Familiar Loft, Triple, Doble Twin, Matrimonial)

## 1. ESTRUCTURA DE ENCABEZADOS
Las cuatro páginas siguen un patrón de excelencia semántica, utilizando un bloque oculto para buscadores y una estructura visual jerarquizada.

### H1: Identidad Específica
- **Familiar Loft:** "Familiar Loft en Loja: El Refugio Ideal para su Familia"
- **Triple:** "Habitación Triple en Loja: Espacio y Confort para Grupos"
- **Doble Twin:** "Habitación Doble Twin en Loja: Confort y Descanso Compartido"
- **Matrimonial:** "Habitación Matrimonial en Loja: Elegancia y Descanso Privado"
- **Análisis:** Los H1 son altamente descriptivos e incluyen la ubicación geográfica ("Loja"), lo cual es crucial para búsquedas locales.

### H2: Secciones de Soporte (Común en todas)
- "Un Espacio Diseñado para su Bienestar" / "Distribución en Dos Niveles"
- "Servicios Exclusivos"
- "¿Por qué elegirnos?"
- "Información de Reserva"

- **Análisis de jerarquía:** Impecable. Sigue una estructura lógica que facilita tanto la lectura del usuario como la indexación de los bots.

---

## 2. METADATOS
Los metadatos están personalizados por habitación:
- **Title tags:** Optimizados (ej: "Familiar Loft en Loja | Hotel El Cardenal"). Todos por debajo de los 60 caracteres.
- **Meta descriptions:** Descriptivas y con llamadas a la acción (ej: "Reserve su escapada hoy").
- **Canonicals:** IMPLEMENTADOS correctamente en las cuatro páginas (Apuntan a su propia URL).
- **Keywords:** Específicas para cada tipo de alojamiento (ej: "estancia romántica", "alojamiento para grupos").

---

## 3. INTENCIÓN DE BÚSQUEDA
- **Cubierta:** **Transaccional (Reserva Directa).**
- **Análisis:** Estas páginas son el "final del embudo". El contenido está totalmente alineado con un usuario que busca reservar una habitación específica.

---

## 4. PALABRAS CLAVE
- **Estrategia:** Long-tail keywords.
- **Densidad:** Excelente uso de variaciones de nombres de habitaciones y términos hoteleros. El bloque oculto refuerza términos como "desayuno tradicional", "parqueadero privado" y "río Malacatos" en cada página.

---

## 5. SCHEMA MARKUP / DATOS ESTRUCTURADOS
- **Detectado:** Ninguno específico de habitación.
- **Faltante:** `HotelRoom` y `Product` / `Offer`.
- **Impacto:** Sin este esquema, Google no puede mostrar precios, disponibilidad o estrellas de calificación directamente en los resultados de búsqueda para la habitación.

---

## 6. OPTIMIZACIÓN ON-PAGE
- **Imágenes:**
    - Se usa un slider en cada página (`SimpleGallerySlider`).
    - Atributos `alt` presentes, aunque podrían ser más variados.
- **Links internos:** Buena navegación de retorno al listado y a la página de contacto.
- **Widgets:** El `RoomBookingWidget` stuck en el lateral (desktop) mejora el engagement y las señales de usuario.

---

## 7. NEXT.JS ESPECÍFICO
- Implementación de `Metadata` estática en Server Components.
- Rendimiento optimizado mediante cargas perezosas y componentes hidratados solo donde es necesario.

---

## 8. PROBLEMAS DETECTADOS
1. **Falta de Schema `HotelRoom`:** Es el problema principal en las 4 páginas. Prioridad: **Alta**.
2. **Duplicación de Contenido Técnico:** Los bloques ocultos comparten gran parte de la información de servicios generales (WiFi, Parking). Aunque es útil, podría modularizarse. Prioridad: **Baja**.

---

## 9. RECOMENDACIONES
- **Mejora Crítica:** Implementar SCHEMA `HotelRoom` en cada página individual, definiendo `occupancy`, `bed`, `amenityFeature` y `price`.
- **Optimización de Conversión:** Asegurarse de que el botón de WhatsApp en el widget de reserva incluya un mensaje predefinido que especifique la habitación desde la que viene el usuario (ej: "Hola, me interesa el Familiar Loft...").
- **Enlazado Interno:** Añadir una sección de "Habitaciones Relacionadas" al final de cada página para reducir la tasa de rebote.
