# Auditoría SEO: Página de Contacto (`/contacto`)

## 1. ESTRUCTURA DE ENCABEZADOS
La página de contacto prioriza la claridad y la accesibilidad de la información de contacto (NAP).

### Jerarquía
- **H1:** "Contacto: Estamos listos para recibirle en Loja"
- **H2:** "Canales de Atención Directa"
- **H2 (Oculto):** "Información de Contacto Directo", "¿Cómo reservar su habitación?", "Ubicación Estratégica".
- **Análisis:** La estructura es funcional. El H1 visual es descriptivo y amigable para el usuario.

---

## 2. METADATOS
- **Title Tag:** "Contacto | Hotel El Cardenal Loja - Reservas y Consultas" (53 caracteres). **Excelente.**
- **Meta Description:** Proporciona una buena visión general de los motivos de contacto (reservas, eventos, tarifas).
- **Keywords:** Muy enfocadas en "teléfono hotel loja" y "dirección hotel el cardenal".
- **Canonical:** Correctamente implementado.

---

## 3. INTENCIÓN DE BÚSQUEDA
- **Cubierta:** **Transaccional / Navegacional.**
- **Análisis:** Responde a usuarios que ya han tomado una decisión de interés y necesitan el paso final (hablar o reservar).

---

## 4. PALABRAS CLAVE
- **Estrategia:** NAP (Name, Address, Phone) y Local SEO.
- **Análisis:** La inclusión de la dirección exacta y el sector (Los Rosales) es vital para aparecer en búsquedas locales "cerca de mi".

---

## 5. SCHEMA MARKUP / DATOS ESTRUCTURADOS
- **Detectado:** Ninguno explicitamente definido en la página (aunque el sitio tiene `LocalBusiness` global).
- **Faltante:** `ContactPage`.
- **Recomendación:** Implementar el esquema `ContactPage` para validar oficialmente los puntos de contacto ante Google.

---

## 6. OPTIMIZACIÓN ON-PAGE
- **Formulario:** Muy completo. Soporta reservas directas con detalles de huéspedes y facturación.
- **Canal de WhatsApp:** El destaque de WhatsApp es una decisión de UX excelente para el mercado latinoamericano, aumentando la tasa de conversión.
- **Ubicación:** Se menciona la cercanía al río Malacatos y Parque La Tebaida, reforzando el SEO semántico de ubicación.

---

## 7. NEXT.JS ESPECÍFICO
- Uso de `useSearchParams` para pre-llenar el formulario (ej: desde la página de eventos), lo cual mejora la tasa de finalización.

---

## 8. PROBLEMAS DETECTADOS
1. **Error de Branding en Alt:** ⚠️ La imagen Hero tiene el alt: "Contacto Hotel Puente Roto". Prioridad: **Crítica**.
2. **Falta de Mapa Interactivo:** Aunque hay un link a Google Maps, un mapa embebido con el PIN del hotel aumentaría el tiempo de permanencia y las señales de SEO local. Prioridad: **Media**.

---

## 9. RECOMENDACIONES
- **Quick Win:** Cambiar el alt de la imagen hero a "Contacto y Fachada Hotel El Cardenal Loja".
- **Mejora de SEO Local:** Embeber un mapa de Google (iFrame) con el perfil oficial de Google Business del hotel.
- **CRO (Conversion Rate Optimization):** Añadir un pequeño badge de "Respuesta en menos de 15 min" junto al link de WhatsApp para incentivar el clic.
