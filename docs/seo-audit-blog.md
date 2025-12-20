# Auditoría SEO: Sección de Blog (Listado y Artículos)

## 1. ESTRUCTURA DE ENCABEZADOS
El blog utiliza una estructura dinámica que se adapta al contenido de cada artículo, manteniendo una buena jerarquía base.

### Listado de Blog (`/blog`)
- **H1 (Oculto):** "Blog de Turismo y Cultura en Loja - Hotel El Cardenal"
- **H2 (Oculto/Visual):** "Artículos Destacados", "¿Por qué leer nuestro blog?"
- **H3:** Títulos de cada artículo en la lista.
- **Análisis:** Estructura sólida que ayuda a posicionar el blog como una fuente de autoridad sobre Loja.

### Artículo Individual (`/blog/[slug]`)
- **H1:** Título dinámico del artículo (ej: "5 Lugares para visitar en Loja").
- **H2-H3:** Generados automáticamente desde el contenido Markdown.
- **Análisis:** El uso de etiquetas semánticas `<article>` y `<time>` es excelente para el SEO de contenidos.

---

## 2. METADATOS
⚠️ **PROBLEMA DE MARCA DETECTADO:**
- **Title Tag (Posts):** `${titulo} | Blog Hotel Puente Roto`. El nombre del hotel es incorrecto (debe ser Hotel El Cardenal).
- **Title Tag (Listado):** "Blog | Hotel El Cardenal Loja" (Muy corto).
- **Meta Description:** Se genera correctamente desde la base de datos.
- **Open Graph:** Bien configurado como tipo `article`, incluyendo fecha de publicación y autor.
- **Canonical:** Presente tanto en el listado como en los artículos.

---

## 3. INTENCIÓN DE BÚSQUEDA
- **Cubierta:** **Informacional.**
- **Análisis:** El blog atrae tráfico de "parte superior del embudo" (usuarios investigando qué hacer en Loja), lo cual es vital para construir autoridad de dominio (Topical Authority).

---

## 4. PALABRAS CLAVE
- **Estrategia:** Long-tail informativas.
- **Análisis:** El sistema permite definir `meta_description` y `palabra_clave` por cada artículo en la base de datos, lo cual es una herramienta poderosa para el SEO editorial.

---

## 5. SCHEMA MARKUP / DATOS ESTRUCTURADOS
- **Detectado:** Ninguno.
- **Faltante:** `Blog` (en el listado) y `BlogPosting` o `NewsArticle` (en los posts).
- **Recomendación:** Implementar `BlogPosting` es crítico para aparecer en el carrusel de noticias de Google y mejorar la visibilidad del autor.

---

## 6. OPTIMIZACIÓN ON-PAGE
- **URLs:** `/blog/[slug]`. Limpias y descriptivas.
- **Imágenes:**
    - Atributo `alt` dinámico usando el título del artículo.
    - Se recomienda usar imágenes en formato WebP (el sistema lo permite).
- **Artículos Relacionados:** La sección de "Artículos Relacionados" al final de cada post es excelente para el "link juice" interno y la retención del usuario.

---

## 7. NEXT.JS ESPECÍFICO
- Uso de `generateMetadata` dinámico para los artículos.
- `force-dynamic` asegura que los nuevos artículos publicados en la DB aparezcan inmediatamente.

---

## 8. PROBLEMAS DETECTADOS
1. **Error de Branding:** Metadata cita a "Hotel Puente Roto" en lugar de "Hotel El Cardenal". Prioridad: **Crítica** (Confunde a Google y al usuario).
2. **Missing `BlogPosting` Schema:** Falta de datos estructurados para los artículos. Prioridad: **Alta**.
3. **Title del Listado:** Muy genérico, le falta fuerza semántica. Prioridad: **Baja**.

---

## 9. RECOMENDACIONES
- **Quick Win (URGENTE):** Corregir el nombre del hotel en la función `generateMetadata` de `src/app/blog/[slug]/page.tsx`.
- **Mejora Crítica:** Implementar el esquema `BlogPosting` en el componente de artículo.
- **SEO Editorial:** Asegurarse de que cada artículo tenga al menos 2 enlaces internos hacia las páginas de habitaciones o servicios para canalizar el tráfico informacional hacia la conversión.
