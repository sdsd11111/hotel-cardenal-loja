# 🎯 Setup Limpio - api.enloja.net

## ✅ Situación Actual:
- `public_html` está limpio ✅
- Subdominio `api.enloja.net` configurado en DNS ✅
- Archivos PHP listos en tu carpeta `cpanel-files` ✅

---

## 📁 PASO 1: Crear Estructura de Carpetas

**En cPanel File Manager:**

1. Ve a `public_html`
2. Crea una carpeta: `api.enloja.net` 
   - (Importante: este nombre debe coincidir con el subdominio)
3. Entra a esa carpeta
4. Dentro de `api.enloja.net`, NO crees subcarpetas
5. Mantén `api.enloja.net` como carpeta vacía por ahora

---

## 📤 PASO 2: Subir los 3 Archivos PHP

**Desde tu PC:**

Tienes estos archivos en: `d:\Abel paginas\HOTEL\hotel\cpanel-files\`

1. **Renombra primero:**
   - `config-READY.php` → `config.php`

2. **Sube estos 3 archivos a `public_html/api.enloja.net/`:**
   - `config.php`
   - `api-platos.php`
   - `upload-imagen.php`

**Cómo subir:**
- En File Manager, dentro de `public_html/api.enloja.net/`
- Click en **Upload**
- Selecciona los 3 archivos
- Sube

---

## 📁 PASO 3: Crear Carpeta de Uploads

1. Vuelve a `public_html`
2. Crea carpeta: `uploads`
3. Dentro de `uploads`, crea: `platos`
4. Permisos de `platos`: **755**

**Estructura final esperada:**
```
public_html/
├── api.enloja.net/
│   ├── config.php
│   ├── api-platos.php
│   └── upload-imagen.php
└── uploads/
    └── platos/ (permisos 755)
```

---

## 🧪 PASO 4: Probar la API

Espera 2-3 minutos y visita:

```
http://api.enloja.net/api-platos.php?activos
```

### ✅ Resultado esperado:
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

### ❌ Si da 404:
Intenta con la ruta completa del subdominio:
```
http://enloja.net/api.enloja.net/api-platos.php?activos
```

---

## 🔧 PASO 5: Si funciona - Actualizar Next.js

Una vez que veas el JSON, actualiza el `.env.local`:

```bash
# Comentar MySQL directo (no funciona sin Remote MySQL)
# MYSQL_HOST=216.246.46.43
# MYSQL_USER=enloja_platos
# MYSQL_PASSWORD=Olakasetk1.
# MYSQL_DATABASE=enloja_platos

# Usar API PHP
CPANEL_API_URL=http://api.enloja.net/api-platos.php
CPANEL_UPLOAD_API_URL=http://api.enloja.net/upload-imagen.php
```

---

## 📋 Checklist

- [ ] Carpeta `public_html/api.enloja.net/` creada
- [ ] `config-READY.php` renombrado a `config.php`
- [ ] 3 archivos PHP subidos a `public_html/api.enloja.net/`
- [ ] Carpeta `public_html/uploads/platos/` creada con permisos 755
- [ ] Probado: `http://api.enloja.net/api-platos.php?activos`
- [ ] JSON visible ✅

---

¡Empieza con el PASO 1 y avísame cuando hayas subido los archivos!
