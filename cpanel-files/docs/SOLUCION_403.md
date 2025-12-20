# 🔧 SOLUCIÓN: Error 403 Forbidden

## 🎯 Problema Detectado

Error 403 al visitar: `enloja.net/api/api-platos.php?activos`

## ✅ Soluciones (En orden de prioridad)

---

### SOLUCIÓN 1: Usar www en la URL

**Intenta con:**
```
https://www.enloja.net/api/api-platos.php?activos
```

**Nota**: Vi en tu captura que usaste `enloja.net` sin el `www`. Algunos servidores requieren el `www` explícitamente.

---

### SOLUCIÓN 2: Cambiar Permisos de Archivos PHP

Los archivos PHP a veces necesitan permisos de ejecución.

**En cPanel File Manager:**

1. Ve a `public_html/api/`
2. **Selecciona los 3 archivos PHP** (mantén Ctrl):
   - `api-platos.php`
   - `config.php`  
   - `upload-imagen.php`
3. **Click derecho** → **Permissions**
4. Cambia de **0644** a **0755**:
   - ✅ Owner: Read, Write, Execute
   - ✅ Group: Read, Execute
   - ✅ World: Read, Execute
5. Click en **Change Permissions**

**Luego prueba nuevamente la URL**

---

### SOLUCIÓN 3: Verificar Permisos de Carpeta "api"

La carpeta también necesita permisos correctos.

1. En File Manager, ve a `public_html`
2. **Click derecho** en la carpeta `api` → **Permissions**
3. Debe ser **0755**:
   - ✅ Owner: Read, Write, Execute
   - ✅ Group: Read, Execute  
   - ✅ World: Read, Execute
4. Click en **Change Permissions**

---

### SOLUCIÓN 4: Crear archivo .htaccess

A veces se necesita un `.htaccess` para permitir acceso.

**Crear archivo .htaccess en public_html/api/:**

1. En File Manager, ve a `public_html/api/`
2. Click en **+ File** o **New File**
3. Nombre del archivo: `.htaccess` (importante el punto al inicio)
4. Click en **Create**
5. **Click derecho** en `.htaccess` → **Edit**
6. Pega este contenido:

```apache
# Permitir acceso a archivos PHP
<Files "*.php">
    Allow from all
    Require all granted
</Files>

# Habilitar PHP
AddHandler application/x-httpd-php .php

# Seguridad básica
Options -Indexes
```

7. Click en **Save Changes**
8. Cierra el editor

**Prueba nuevamente la URL**

---

### SOLUCIÓN 5: Archivo de prueba simple

Vamos a crear un archivo PHP super simple para verificar que PHP funciona.

**Crear test.php:**

1. En File Manager, ve a `public_html/api/`
2. Click en **+ File**
3. Nombre: `test.php`
4. Click derecho → **Edit**
5. Pega este código:

```php
<?php
echo "PHP funciona!";
phpinfo();
?>
```

6. Guarda
7. Visita: `https://www.enloja.net/api/test.php`

**Resultados esperados:**
- ✅ Si ves "PHP funciona!" y una página con información de PHP → **PHP está funcionando**
- ❌ Si ves 403 → **Problema de permisos o configuración del servidor**
- ❌ Si ves el código PHP como texto → **PHP no está habilitado**

---

### SOLUCIÓN 6: Verificar en Error Log

Si nada funciona, revisemos los logs de error.

1. En cPanel, busca **"Errors"** o **"Error Log"**
2. Click en **Error Log**
3. Busca errores recientes relacionados con `/api/api-platos.php`
4. **Copia el error** y me lo pasas

---

## 📋 Checklist de Soluciones

Prueba en este orden:

- [ ] Probar con `https://www.enloja.net/api/api-platos.php?activos` (con www)
- [ ] Cambiar permisos de archivos PHP a **0755**
- [ ] Verificar permisos de carpeta `api` es **0755**
- [ ] Crear archivo `.htaccess` en `public_html/api/`
- [ ] Crear y probar `test.php`
- [ ] Revisar Error Log si todo lo anterior falla

---

## 🎯 Siguiente Paso

**Después de aplicar las soluciones, prueba:**

1. `https://www.enloja.net/api/test.php` (debería mostrar "PHP funciona!")
2. `https://www.enloja.net/api/api-platos.php?activos` (debería mostrar JSON)

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

---

## 💬 Reporta Resultados

Después de probar las soluciones, dime:
1. ¿Qué solución funcionó?
2. ¿Qué ves ahora al visitar la URL?
3. ¿Algún error en el Error Log?

¡Avísame cómo te va!
