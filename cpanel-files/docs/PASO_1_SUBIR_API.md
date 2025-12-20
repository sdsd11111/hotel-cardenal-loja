# 🚀 PASO 1: Subir API a cPanel y Probar

## 📋 Preparación (En tu computadora)

### 1. Renombrar archivo

1. Ve a la carpeta: `d:\Abel paginas\HOTEL\hotel\cpanel-files\`
2. **Renombra** el archivo `config-READY.php` → `config.php`
   - Click derecho → Rename
   - O presiona F2
   - Nuevo nombre: `config.php`

✅ **Ahora tienes estos 3 archivos listos para subir:**
- `config.php`
- `api-platos.php`
- `upload-imagen.php`

---

## 📤 Subir a cPanel

### 2. Acceder a cPanel

1. Abre tu navegador
2. Ve a: **https://www.enloja.net:2083** (o tu URL de cPanel)
3. Ingresa con tus credenciales de cPanel
4. Busca el ícono **"File Manager"** o **"Administrador de archivos"**
5. Click en **File Manager**

### 3. Navegar a public_html

1. En File Manager, verás una lista de carpetas
2. **Haz doble click** en la carpeta `public_html`
3. Deberías ver archivos como `index.html` o carpetas

### 4. Crear carpeta "api"

1. En la parte superior, busca el botón **"+ Folder"** o **"Nueva carpeta"**
2. Click en ese botón
3. Nombre de carpeta: `api`
4. Click en **"Create New Folder"** o **"Crear"**
5. Verás que aparece la carpeta `api` en la lista

### 5. Entrar a la carpeta "api"

1. **Doble click** en la carpeta `api` que acabas de crear
2. La carpeta debería estar vacía
3. La ruta arriba debería mostrar: `public_html/api`

### 6. Subir los 3 archivos PHP

1. Busca el botón **"Upload"** o **"Subir archivos"** (arriba)
2. Click en **"Upload"**
3. Se abrirá una nueva página de subida
4. Click en **"Select File"** o **"Seleccionar archivo"**
5. Navega a: `d:\Abel paginas\HOTEL\hotel\cpanel-files\`
6. **Selecciona los 3 archivos** (mantén Ctrl presionado):
   - `config.php`
   - `api-platos.php`
   - `upload-imagen.php`
7. Click en **"Open"** o **"Abrir"**
8. Espera a que termine la subida (verás una barra de progreso)
9. Cuando veas "Upload Complete" o "100%", continúa
10. Click en **"Go Back to..."** o vuelve atrás

✅ **Verificación**: Deberías ver los 3 archivos PHP en `public_html/api/`

---

## 📁 Crear Carpeta de Uploads

### 7. Volver a public_html

1. En File Manager, navegador arriba donde dice la ruta
2. Click en `public_html` para volver a la carpeta principal
3. O usa el botón "Up One Level" / "Subir un nivel"

### 8. Crear carpeta "uploads"

1. Click en **"+ Folder"**
2. Nombre: `uploads`
3. Click en **"Create"**
4. **Doble click** en la carpeta `uploads` para entrar

### 9. Crear carpeta "platos" dentro de uploads

1. Dentro de `uploads`, click en **"+ Folder"**
2. Nombre: `platos`
3. Click en **"Create"**

### 10. Configurar permisos de la carpeta "platos"

1. **Click derecho** en la carpeta `platos`
2. Selecciona **"Permissions"** o **"Propiedades"**
3. En la ventana que se abre, busca las casillas de permisos
4. Marca estas casillas:
   - **Owner**: ✅ Read ✅ Write ✅ Execute
   - **Group**: ✅ Read ❌ Write ✅ Execute
   - **World/Public**: ✅ Read ❌ Write ✅ Execute
5. El número debería mostrar **755**
6. Click en **"Change Permissions"** o **"Guardar"**

✅ **Ruta final**: `public_html/uploads/platos/` (permisos: 755)

---

## 🧪 PROBAR LA API

### 11. Verificar que la API funciona

1. Abre una **nueva pestaña** en tu navegador
2. Visita esta URL: 
   
   **https://www.enloja.net/api/api-platos.php?activos**

3. Deberías ver algo como esto:

```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

---

## ✅ Resultados Esperados

### SI VES ESTO: ✅ ¡PERFECTO!

```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

**Significa:**
- ✅ Los archivos PHP están en el lugar correcto
- ✅ La conexión a MySQL funciona
- ✅ La API está lista
- ✅ No hay platos todavía (porque aún no migramos datos)

**Siguiente paso:** Migrar los datos de Supabase

---

### SI VES ERRORES: ❌

**Error 404 - Not Found**
- ❌ Los archivos no están en la ubicación correcta
- **Solución**: Verifica que los archivos estén en `public_html/api/`

**Error 500 - Internal Server Error**
- ❌ Problema con PHP o credenciales de MySQL
- **Solución**: 
  1. Ve a cPanel → Errors → Error Log
  2. Revisa el último error
  3. Verifica que `config.php` tenga las credenciales correctas:
     - DB_NAME: `enloja_platos`
     - DB_USER: `enloja_platos`
     - DB_PASS: `Olakasetk1.`

**Pantalla en blanco o texto PHP**
- ❌ PHP no se está ejecutando
- **Solución**: Verifica que los archivos tengan extensión `.php` no `.txt`

**Error de CORS**
- ✅ Esto es normal por ahora (lo probaremos desde Next.js después)

---

## 📸 Capturas de Pantalla Útiles

**Cuando termines, tómale captura a:**
1. File Manager mostrando los archivos en `public_html/api/`
2. La respuesta JSON en el navegador
3. Cualquier error que veas (si hay)

---

## 🎯 Checklist del Paso 1

- [ ] `config-READY.php` renombrado a `config.php`
- [ ] Carpeta `api` creada en `public_html`
- [ ] 3 archivos PHP subidos a `public_html/api/`
- [ ] Carpeta `uploads/platos/` creada
- [ ] Permisos 755 en carpeta `platos`
- [ ] URL probada: https://www.enloja.net/api/api-platos.php?activos
- [ ] Respuesta JSON visible ✅

---

## 🎉 ¿Listo?

Una vez que veas el JSON funcionando, ¡dame la confirmación y pasamos al PASO 2!

**PASO 2 será:** Migrar los datos de Supabase a MySQL
