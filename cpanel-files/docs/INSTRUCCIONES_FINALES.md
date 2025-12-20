# 🚀 INSTRUCCIONES FINALES - Migración Lista

## ✅ Archivos Listos para Subir

Tienes 3 archivos PHP completamente configurados:

1. **config-READY.php** ✅ 
   - Credenciales de MySQL configuradas
   - CORS configurado para enloja.net y hotel-loja.vercel.app
   - **RENOMBRA a `config.php` antes de subir**

2. **api-platos.php** ✅ Listo para usar

3. **upload-imagen.php** ✅ Listo para usar

---

## 📤 PASO 1: Subir Archivos a cPanel

### 1.1 Renombrar archivo
- **Renombra** `config-READY.php` → `config.php`

### 1.2 Acceder a File Manager
1. Accede a tu cPanel de enloja.net
2. Abre **File Manager**
3. Navega a `public_html`

### 1.3 Crear carpeta API
1. Click en **+ Folder** o **New Folder**
2. Nombre: `api`
3. Click en **Create New Folder**

### 1.4 Subir archivos PHP
1. Entra a la carpeta `api` que acabas de crear
2. Click en **Upload**
3. Arrastra o selecciona estos 3 archivos:
   - ✅ `config.php` (el renombrado)
   - ✅ `api-platos.php`
   - ✅ `upload-imagen.php`
4. Espera a que termine la subida
5. Click en **Go Back to...** para volver a File Manager

**Ruta final**: `public_html/api/config.php`, `api-platos.php`, `upload-imagen.php`

---

## 📁 PASO 2: Crear Carpeta de Uploads

1. En File Manager, asegúrate de estar en `public_html`
2. Click en **+ Folder**
3. Nombre: `uploads`
4. Entra a la carpeta `uploads`
5. Click en **+ Folder** nuevamente
6. Nombre: `platos`
7. **Importante**: Click derecho en la carpeta `platos` → **Permissions**
8. Cambia a `755` (marca: Owner: Read/Write/Execute, Group: Read/Execute, World: Read/Execute)
9. Click en **Change Permissions**

**Ruta final**: `public_html/uploads/platos/` (permisos: 755)

---

## 🧪 PASO 3: Probar la API

1. Abre una nueva pestaña en tu navegador
2. Visita: **https://www.enloja.net/api/api-platos.php?activos**
3. Deberías ver esto:
   ```json
   {
     "success": true,
     "data": [],
     "count": 0
   }
   ```

✅ **Si ves eso, la API funciona perfectamente!**

❌ **Si ves un error**:
- Error 404: Verifica que los archivos estén en `public_html/api/`
- Error 500: Ve a cPanel → Errors → Error Log y revisa
- Error de conexión: Verifica las credenciales en `config.php`

---

## 💾 PASO 4: Migrar Datos de Supabase

### 4.1 Ejecutar Script de Migración

En tu máquina local (PowerShell o terminal):

```bash
# Navega a la carpeta de tu proyecto
cd "d:\Abel paginas\HOTEL\hotel"

# Ejecuta el script de migración
node C:\Users\Smart\.gemini\antigravity\brain\e7907ed7-c1c6-40ce-8abd-399f6810ab9e\migrate-data.js
```

El script generará:
- `migration_inserts.sql` - Inserts de MySQL
- `migration_images.json` - Listado de imágenes

### 4.2 Importar a MySQL

1. Abre el archivo generado `migration_inserts.sql` en un editor de texto
2. **Copia todo el contenido** (Ctrl+A → Ctrl+C)
3. Ve a cPanel → **phpMyAdmin**
4. En el panel izquierdo, selecciona la base de datos **`enloja_platos`**
5. Click en la pestaña **SQL** (arriba)
6. **Pega** el contenido copiado en el cuadro de texto
7. Click en **Go** / **Continuar** (abajo a la derecha)
8. Deberías ver: "X rows inserted" o "Consulta ejecutada correctamente"

### 4.3 Verificar Datos

En phpMyAdmin:
1. Click en la base de datos `enloja_platos`
2. Click en la tabla `platos`
3. Click en pestaña **Browse** / **Examinar**
4. Deberías ver tus platos importados

---

## 🔧 PASO 5: Actualizar Proyecto Next.js

### 5.1 Actualizar .env.local

Abre `.env.local` en tu proyecto y modifica:

```bash
# === COMENTAR/ELIMINAR (Supabase) ===
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# === AGREGAR (cPanel) ===
CPANEL_API_URL=https://www.enloja.net/api/api-platos.php
CPANEL_UPLOAD_API_URL=https://www.enloja.net/api/upload-imagen.php
```

### 5.2 Eliminar Dependencias de Supabase

Abre `package.json` y **elimina** estas líneas:

```json
"@supabase/auth-helpers-nextjs": "^0.10.0",
"@supabase/ssr": "^0.7.0",
"@supabase/supabase-js": "^2.78.0",
```

Luego ejecuta:

```bash
npm install
```

### 5.3 Eliminar archivo de Supabase

```bash
# En PowerShell (Windows)
Remove-Item src\lib\supabase.ts
```

### 5.4 Probar Localmente

**Reinicia el servidor de desarrollo**:
```bash
# Presiona Ctrl+C para detener
# Luego inicia nuevamente
npm run dev
```

Visita: **http://localhost:3000/servicios/restaurante**

✅ Verifica:
- El hero dinámico muestra platos
- Las imágenes cargan (desde Supabase temporalmente)
- El carousel funciona
- No hay errores en la consola (F12)

---

## ☁️ PASO 6: Configurar Vercel

### 6.1 Agregar Variables de Entorno

1. Ve a: **https://vercel.com/dashboard**
2. Selecciona tu proyecto **hotel-loja**
3. Click en **Settings** (arriba)
4. En el menú lateral: **Environment Variables**

5. **Agregar CPANEL_API_URL**:
   - Name: `CPANEL_API_URL`
   - Value: `https://www.enloja.net/api/api-platos.php`
   - Environment: ✅ Production ✅ Preview ✅ Development
   - Click **Save**

6. **Agregar CPANEL_UPLOAD_API_URL**:
   - Name: `CPANEL_UPLOAD_API_URL`
   - Value: `https://www.enloja.net/api/upload-imagen.php`
   - Environment: ✅ Production ✅ Preview ✅ Development
   - Click **Save**

### 6.2 Eliminar Variables de Supabase (Opcional)

En la misma sección, busca y elimina:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

(Click en los 3 puntos → Delete)

---

## 🚀 PASO 7: Deploy a Producción

### 7.1 Commit y Push

```bash
git add .
git commit -m "Migración de Supabase a cPanel MySQL completada"
git push origin main
```

### 7.2 Esperar Deployment

1. Ve a Vercel Dashboard
2. Verás que se inicia un nuevo deployment automáticamente
3. Espera a que el status sea "Ready" (≈2-3 minutos)

---

## ✅ PASO 8: Verificación Final

### 8.1 Probar en Producción

1. Visita: **https://www.enloja.net/servicios/restaurante**
2. Verifica:
   - ✅ El hero dinámico aparece
   - ✅ Se muestran los platos correctos
   - ✅ Las imágenes cargan
   - ✅ El carousel rota automáticamente
   - ✅ Los botones funcionan

### 8.2 Verificar API en Producción

Visita: **https://www.enloja.net/api/api-platos.php?activos**

Deberías ver JSON con tus platos:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "titulo": "...",
      "descripcion": "...",
      "precio": ...,
      ...
    }
  ],
  "count": X
}
```

---

## 🎯 Checklist Final

- [ ] Archivos PHP subidos a `public_html/api/`
- [ ] Carpeta `uploads/platos/` creada con permisos 755
- [ ] API responde en https://www.enloja.net/api/api-platos.php?activos
- [ ] Datos migrados de Supabase
- [ ] `.env.local` actualizado con URLs de cPanel
- [ ] Dependencias de Supabase eliminadas de `package.json`
- [ ] `src/lib/supabase.ts` eliminado
- [ ] Probado localmente ✅
- [ ] Variables configuradas en Vercel
- [ ] Código pusheado a GitHub
- [ ] Deployment en Vercel completado
- [ ] Verificado en producción en www.enloja.net ✅

---

## 🎉 ¡Felicidades!

Si todos los pasos están marcados, la migración está **100% completada**.

Tu aplicación ahora usa:
- ✅ MySQL en cPanel (enloja.net)
- ✅ PHP REST API propia
- ✅ Sin costos de Supabase
- ✅ Control total de tus datos

---

## 📝 Notas Importantes

**Sobre las imágenes:**
- Actualmente seguirán cargando desde Supabase Storage
- Esto es temporal y funcional
- Puedes migrarlas gradualmente a `/uploads/platos/` cuando quieras

**Si necesitas ayuda:**
- Error logs: cPanel → Errors → Error Log
- Vercel logs: Dashboard → Deployments → Click en deployment → Function Logs
- Database: cPanel → phpMyAdmin

**Backup recomendado:**
- En phpMyAdmin, exporta la tabla `platos` regularmente
- Guarda copias de los archivos PHP

---

¡Todo listo para producción! 🚀
