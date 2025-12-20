# Auditoría SEO: Página de Habitaciones (Listado)

## 1. ESTRUCTURA DE ENCABEZADOS
La página mantiene la estrategia de combinar contenido visual atractivo con un bloque semántico oculto optimizado para buscadores.

### H1: Principal
- **Texto exacto:** "Nuestras Habitaciones" (Visual) / "Nuestras Habitaciones - Hotel El Cardenal Loja" (Oculto)
- **Cantidad:** 2
- **Análisis:** El H1 visual es directo. El H1 oculto añade el nombre de la marca, lo cual es positivo para E-E-A-T.

### H2: Secciones de Soporte
- "Opciones de Alojamiento" (Oculto)
- "Beneficios Incluidos en su Estancia" (Oculto)
- *Nota:* En la parte visual (Client Component), no se detectan H2s explícitos fuera del bloque oculto, lo que deja gran parte del peso semántico al bloque técnico.

### H3: Categorías
- "Familiar Loft", "Habitación Triple", "Habitación Doble Twin", "Habitación Matrimonial".
- Aparecen tanto en el bloque oculto como en las tarjetas visuales de cada habitación.

- **Análisis de jerarquía:** Correcta. El uso de H3 para cada habitación en el listado es el estándar de la industria y ayuda a Google a entender que hay múltiples "entidades" de producto en la página.

---

## 2. METADATOS
- **Title tag:** "Habitaciones | Hotel El Cardenal Loja - Confort y Descanso" (55 caracteres). **Excelente.**
- **Meta description:** "Explore nuestras 6 exclusivas habitaciones en Loja: Loft Familiar, Triple, Doble Twin y Matrimonial. El mejor hospedaje familiar junto al río Malacatos." (151 caracteres). **Excelente.**
- **Meta keywords:** `['hotel familiar en Loja', 'habitaciones Loja', 'hospedaje Loja', 'Hotel El Cardenal', 'confort', 'descanso', 'sector Los Rosales']`
- **Canonical URL:** No especificada explícitamente en el `page.tsx`, hereda la lógica global. Se recomienda añadirla.

---

## 3. INTENCIÓN DE BÚSQUEDA
- **Cubierta:** **Comercial / Transaccional.**
- **Análisis:** El usuario que llega aquí ya sabe que quiere hospedarse en Loja y está comparando opciones específicas. La página responde bien con precios, amenidades y botón de "Reservar".

---

## 4. PALABRAS CLAVE
- **Palabra clave principal:** "Habitaciones Loja"
- **Palabras clave secundarias:** "Alojamiento en Loja", "Hospedaje familiar Loja".
- **Densidad:** Muy buena. Los nombres de las habitaciones y las descripciones técnicas en el bloque oculto refuerzan el campo semántico de "hotelería".

---

## 5. SCHEMA MARKUP / DATOS ESTRUCTURADOS
- **Detectado:** Ninguno específico en esta página.
- **Faltante:** `ItemList` (para el listado de habitaciones) y `HotelRoom` (opcionalmente para cada ítem).
- **Validación:** Implementar un esquema `ItemList` ayudaría a los buscadores a indexar cada tipo de habitación como un producto disponible.

---

## 6. OPTIMIZACIÓN ON-PAGE
- **URLs:** El listado es `/habitaciones`. Las páginas individuales son `/habitaciones/[slug]`. Estructura limpia y semántica.
- **Imágenes:**
    - Usa `Next/Image` con `priority` en el Hero.
    - Alt tags: `alt={habitacion.nombre}`. Es correcto, aunque podría enriquecerse (ej: "Habitación Matrimonial en Hotel El Cardenal Loja").
- **Filtros:** El sistema de filtros por adultos/niños es funcional para el usuario, pero no afecta al SEO (es cliente-side), lo cual es correcto para evitar contenido duplicado.

---

## 7. NEXT.JS ESPECÍFICO
- Uso correcto de `Suspense` para la carga de datos del cliente.
- El bloque SEO está en el componente de servidor, garantizando que los crawlers lean el texto antes de que se ejecute el JS.

---

## 8. PROBLEMAS DETECTADOS
1. **Falta de Schema `ItemList`:** Google no recibe una señal clara de que esto es un catálogo de habitaciones. Prioridad: **Alta**.
2. **H1 Visual Genérico:** "Nuestras Habitaciones" es muy común. Prioridad: **Baja**.
3. **Canonical:** Falta tag canonical explícito en este `page.tsx`. Prioridad: **Media**.

---

## 9. RECOMENDACIONES
- **Quick Win:** Cambiar el H1 visual a "Habitaciones y Alojamiento en Loja" para capturar búsquedas más amplias.
- **Mejora Crítica:** Añadir un `JSON-LD` de tipo `ItemList` que liste los nombres, URLs y precios de las habitaciones.
- **Optimización de Alts:** Cambiar los alts de las imágenes de las habitaciones para incluir el nombre de la ciudad y el hotel.
