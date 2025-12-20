# 🌐 Crear Subdominio api.enloja.net en cPanel

## 📋 Objetivo

Crear `api.enloja.net` para acceder a los archivos PHP en cPanel, ya que `enloja.net` apunta a Vercel.

---

## 🚀 PASO 1: Crear Subdominio en cPanel

### 1.1 Acceder a Subdominios

1. Accede a tu **cPanel** de enloja.net
2. Busca la sección **"Domains"** o **"Dominios"**
3. Click en **"Subdomains"** o **"Subdominios"**

### 1.2 Crear el Subdominio

1. Verás un formulario "Create a Subdomain"
2. En **"Subdomain"**: escribe `api`
3. En **"Domain"**: selecciona `enloja.net` (si hay opciones)
4. En **"Document Root"**: 
   - **IMPORTANTE**: Cambia la ruta automática
   - De: `public_html/api` 
   - A: `public_html/api`
   - (Debería quedar igual, pero verifica que apunte a la carpeta correcta)
5. Click en **"Create"** o **"Crear"**

✅ **Resultado esperado**: Mensaje "Subdomain api.enloja.net has been created"

---

## 🔧 PASO 2: Verificar DNS (Importante)

### 2.1 Esperar Propagación DNS

Después de crear el subdominio:
- **Tiempo de espera**: 5-15 minutos (a veces hasta 1 hora)
- El subdominio necesita propagarse en los DNS

### 2.2 Verificar que el subdominio funciona

Mientras esperas, puedes verificar:

1. Abre una terminal/PowerShell
2. Ejecuta:
   ```
   nslookup api.enloja.net
   ```

**Resultados esperados:**
- Debería mostrar una IP del servidor de cPanel
- Si muestra la IP de Vercel, espera más tiempo

---

## 🧪 PASO 3: Probar el Subdominio

### 3.1 Crear archivo de prueba

1. En cPanel File Manager, ve a `public_html/api/`
2. Si no existe `test.php`, créalo:
   - Click en **+ File**
   - Nombre: `test.php`
   - Edítalo y pega:

```php
<?php
echo json_encode([
    'success' => true,
    'message' => 'API subdomain funciona!',
    'subdomain' => 'api.enloja.net'
]);
?>
```

3. Guarda el archivo

### 3.2 Probar en el navegador

Visita: **https://api.enloja.net/test.php**

**Resultados esperados:**

✅ **Si funciona:**
```json
{
  "success": true,
  "message": "API subdomain funciona!",
  "subdomain": "api.enloja.net"
}
```

❌ **Si ves error de SSL/HTTPS:**
- Es normal al principio
- Prueba con **http** (sin s): `http://api.enloja.net/test.php`
- Luego configuraremos SSL

❌ **Si ves "Sitio no encontrado":**
- Espera 5-10 minutos más (propagación DNS)
- Verifica que el subdominio se creó correctamente en cPanel

---

## 🔒 PASO 4: Configurar SSL (Opcional pero recomendado)

### 4.1 SSL Automático (Let's Encrypt)

1. En cPanel, busca **"SSL/TLS Status"** o **"Estado SSL"**
2. Click en **"SSL/TLS Status"**
3. Busca `api.enloja.net` en la lista
4. Si tiene un botón **"Run AutoSSL"**, haz click
5. Espera 2-3 minutos

**O bien:**

1. En cPanel, busca **"Let's Encrypt SSL"**
2. Selecciona el subdominio `api.enloja.net`
3. Click en **"Issue"** o **"Instalar"**

### 4.2 Verificar HTTPS

Después de instalar SSL, visita:
**https://api.enloja.net/test.php** (con HTTPS)

✅ Debería funcionar sin advertencias de seguridad

---

## 🎯 PASO 5: Probar la API Completa

Una vez que el subdominio funciona, prueba la API real:

**URL nueva:** 
```
https://api.enloja.net/api-platos.php?activos
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

✅ **Si ves esto, la API está funcionando perfectamente!**

---

## 📝 PASO 6: Actualizar Variables de Entorno

Una vez que todo funcione, actualiza las URLs:

### En `.env.local`:
```bash
# Cambiar de:
# CPANEL_API_URL=https://www.enloja.net/api/api-platos.php

# A:
CPANEL_API_URL=https://api.enloja.net/api-platos.php
CPANEL_UPLOAD_API_URL=https://api.enloja.net/upload-imagen.php
```

### En Vercel (después):
- Actualiza las mismas variables en Vercel Dashboard

---

## ⚠️ Troubleshooting

### Problema: "Subdomain already exists"

**Solución**: El subdominio ya existe, salta al PASO 3 para probarlo.

---

### Problema: SSL no se instala

**Solución**: 
1. Usa HTTP temporalmente: `http://api.enloja.net/api-platos.php?activos`
2. Configura SSL manualmente después
3. O contacta al soporte de hosting

---

### Problema: DNS apunta a Vercel

Si `api.enloja.net` sigue apuntando a Vercel:

**Solución**:
1. Ve a tu proveedor de DNS (donde configuraste los DNS de Vercel)
2. Agrega un registro A para `api`:
   - Type: `A`
   - Name: `api`
   - Value: `[IP del servidor cPanel]` (pregunta al soporte si no la sabes)
   - TTL: `3600`

---

## ✅ Checklist

- [ ] Subdominio `api` creado en cPanel
- [ ] Document Root apunta a `public_html/api`
- [ ] Esperé 5-15 minutos para propagación DNS
- [ ] `test.php` creado y probado
- [ ] http://api.enloja.net/test.php funciona
- [ ] SSL configurado (opcional)
- [ ] https://api.enloja.net/api-platos.php?activos devuelve JSON
- [ ] Variables de entorno actualizadas

---

## 🎉 Siguiente Paso

Una vez que veas el JSON funcionando en `https://api.enloja.net/api-platos.php?activos`, avísame para:

**PASO 2**: Migrar los datos de Supabase a MySQL

¡Reporta cómo te va con la creación del subdominio!
