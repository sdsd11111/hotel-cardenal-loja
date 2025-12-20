# 🌐 Crear Subdominio Manualmente via DNS

## 📋 Situación

No tienes acceso a la opción "Subdominios" en cPanel, pero podemos crear el subdominio `api.enloja.net` manualmente usando **Zone Editor** (que SÍ tienes).

---

## 🚀 PASO 1: Encontrar la IP del Servidor

Necesitamos la IP de tu servidor de cPanel.

### Opción A: Desde Zone Editor (La que veo en tu captura)

Mirando tu captura, veo un registro A para `enloja.net` que muestra:
```
A    216.198.79.1
```

**Esta es la IP del servidor:** `216.198.79.1`

✅ **Usaremos esta IP**

### Opción B: Verificar en otra parte

Si quieres confirmarlo:
1. En cPanel, busca **"Server Information"** o **"Información del servidor"**
2. Busca "Shared IP Address" o "IP Compartida"

---

## 🔧 PASO 2: Crear Registro A para el Subdominio

### 2.1 Ir a Zone Editor

1. En cPanel, ve a **"Zone Editor"** (ya estás ahí según la captura)
2. Busca el dominio `enloja.net`
3. Click en **"+ A Record"** o **"Añadir Registro"** → **"A"**

### 2.2 Agregar el Registro

En el formulario que aparece:

**Name/Nombre:**
```
api
```
O si pide el nombre completo:
```
api.enloja.net
```

**TTL (Time to Live):**
```
14400
```
(o déjalo en el valor por defecto)

**Type/Tipo:**
```
A
```

**Address/Dirección/Apunta a:**
```
216.198.79.1
```
(La IP que vimos en el PASO 1)

### 2.3 Guardar

1. Click en **"Add Record"** o **"Añadir Registro"**
2. Deberías ver un mensaje de confirmación

✅ **Resultado**: Ahora tienes un registro A para `api.enloja.net`

---

## ⏱️ PASO 3: Esperar Propagación DNS

**Tiempo de espera:** 5-30 minutos (a veces hasta 1 hora)

### Verificar propagación

**En PowerShell/Terminal:**
```bash
nslookup api.enloja.net
```

**Resultado esperado:**
```
Name:    api.enloja.net
Address: 216.198.79.1
```

---

## 📁 PASO 4: Verificar Acceso a Archivos

Una vez propagado el DNS, el subdominio `api.enloja.net` debería apuntar a tu servidor.

**Pero hay un problema:** El subdominio apunta al servidor, pero no específicamente a la carpeta `public_html/api/`

### Solución: Crear Alias/Symlink (Siguiente paso)

Tenemos 2 opciones:

#### Opción A: Acceder con ruta completa
```
https://api.enloja.net/api/api-platos.php?activos
```
(Nota la carpeta `/api/` en la ruta)

#### Opción B: Crear .htaccess para redirigir

Crear un archivo `.htaccess` en `public_html` con:

```apache
# Si el host es api.enloja.net, redirigir a la carpeta api
RewriteEngine On
RewriteCond %{HTTP_HOST} ^api\.enloja\.net$ [NC]
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /api/$1 [L]
```

---

## 🧪 PASO 5: Probar

### Después de crear el registro A y esperar:

**URL a probar:**
```
http://api.enloja.net/api/api-platos.php?activos
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

---

## 🎯 Checklist

- [ ] Registro A creado en Zone Editor
  - Name: `api`
  - Type: `A`
  - Address: `216.198.79.1`
- [ ] Guardado correctamente
- [ ] Esperé 10-15 minutos
- [ ] Verificado con `nslookup api.enloja.net`
- [ ] Probado `http://api.enloja.net/api/api-platos.php?activos`

---

## ⚠️ Alternativa Más Simple

Si todo esto es complicado, tenemos una **opción más directa**:

### Usar la IP directamente (temporal)

En lugar de crear subdominio, usar:
```
http://216.198.79.1/~usuario/api/api-platos.php?activos
```

**🤔 ¿Cuál es tu nombre de usuario de cPanel?**

Con eso puedo darte la URL exacta para acceder directamente.

---

## 💬 Siguiente Paso

**Dime:**
1. ¿Pudiste crear el registro A en Zone Editor?
2. ¿O prefieres que te ayude con la opción de IP directa?

¡Avísame para continuar!
