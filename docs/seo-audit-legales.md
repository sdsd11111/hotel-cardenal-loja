# Auditoría SEO: Páginas Legales (`/privacidad`, `/terminos`, `/cookies`)

## 1. ESTRUCTURA DE ENCABEZADOS
Las páginas legales utilizan una estructura estándar de secciones numeradas.

### Jerarquía
- **H1:** Título de la política (Privacidad, Términos, Cookies).
- **H2:** Secciones (Introducción, Responsable, Datos, etc.).
- **Análisis:** Correcto y fácil de leer para el usuario.

---

## 2. METADATOS
- **Estado:** ⚠️ **CRÍTICO.** Ninguna de las tres páginas exporta un objeto `metadata`.
- **Impacto:** Aparecen sin título descriptivo en los resultados de búsqueda o pestañas del navegador, lo que resta profesionalismo.
- **Recomendación:** Añadir `export const metadata: Metadata = { title: '...', robots: 'noindex, follow' }` en cada una.

---

## 3. INTENCIÓN DE BÚSQUEDA
- **Cubierta:** **Informativa / Legal.**
- **Análisis:** Destinadas a usuarios que ya están en el sitio y necesitan validar la confianza y legalidad del negocio.

---

## 4. PALABRAS CLAVE
- **Estrategia:** Cumplimiento normativo (LOPDP Ecuador).
- **Análisis:** El uso de términos como "Ley Orgánica de Protección de Datos Personales" es excelente para la credibilidad local.

---

## 5. SCHEMA MARKUP / DATOS ESTRUCTURADOS
- **No requerido** para estas páginas, aunque un esquema de `Organization` global las cubre.

---

## 6. OPTIMIZACIÓN ON-PAGE
- **Branding:** Las tres páginas han sido actualizadas y ya no contienen referencias a "Puente Roto".
- **Contacto:** La información de contacto (teléfono, email, dirección) es consistente en todas las páginas.
- **Legalidad:** Se basan correctamente en la legislación ecuatoriana.

---

## 7. NEXT.JS ESPECÍFICO
- Son componentes de cliente (`'use client'`). Esto no es ideal para páginas de puro texto legal que podrían ser componentes de servidor para una carga instantánea.

---

## 8. PROBLEMAS DETECTADOS
1. **Ausencia de Metadatos:** No tienen Title Tag ni Meta Description definidos a nivel de página. Prioridad: **Alta**.
2. **Falta de Directiva Noindex:** Google podría indexar estas páginas y mostrarlas como resultados principales, lo cual no es el objetivo de una estrategia de marketing. Prioridad: **Media**.
3. **Typo en Fecha:** `/terminos` menciona "Diciembre 2025" como última actualización. Prioridad: **Baja**.

---

## 9. RECOMENDACIONES
- **Acción Inmediata:** Implementar metadatos básicos en los archivos `page.tsx`.
- **Robots:** Configurar `robots: { index: false, follow: true }` para que no compitan con las páginas de conversión pero transmitan autoridad.
- **Internal Linking:** Asegurar que el footer enlace a estas páginas con `rel="nofollow"` para concentrar el "link juice" en las páginas comerciales.
