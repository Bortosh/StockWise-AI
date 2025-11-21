# 🔧 Advanced Troubleshooting Guide

## Problemas Comunes y Soluciones

### 1. Backend No Inicia

#### Síntoma: "Port 3000 already in use"
```bash
# Windows - Encontrar proceso en puerto 3000
netstat -ano | findstr :3000

# Matar proceso
taskkill /PID <PID> /F

# O cambiar puerto en .env
PORT=3001
```

#### Síntoma: "Cannot find module 'express'"
```bash
cd backend
rm -rf node_modules
npm install --force
npm run dev
```

#### Síntoma: "Database locked"
```bash
# Eliminar archivo de database
rm -rf backend/data/inventory.db

# Reiniciar backend
npm run dev
```

---

### 2. Frontend No Conecta

#### Síntoma: "Failed to fetch products"
```bash
# Verificar .env
cat .env
# Debe tener:
# VITE_API_URL=http://localhost:3000/api
# VITE_USE_API=true

# Verificar backend está corriendo
curl http://localhost:3000/health

# Si no, iniciar backend
cd backend && npm run dev
```

#### Síntoma: "CORS error"
```bash
# Backend CORS está en src/middleware/cors.ts
# Verificar que está habilitado en index.ts

# Debería haber:
app.use(corsMiddleware)

# Restart backend
```

#### Síntoma: "Vite port 5173 already in use"
```bash
# Cambiar puerto
npm run dev -- --port 5174

# O matar proceso
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows
```

---

### 3. Problemas de Base de Datos

#### Síntoma: "UNIQUE constraint failed"
```
Posible causa: Intento de crear producto duplicado
Solución: Base de datos no replica IDs si usa el mismo UUID
Verificar: Backend genera UUIDs correctamente
```

#### Síntoma: "Foreign key constraint failed"
```
Posible causa: Eliminar producto que tiene inputs/outputs
Solución: Backend tiene DELETE CASCADE configurado
Verificar: 
  - Relaciones en init.ts
  - foreign_keys pragma está habilitada
```

#### Síntoma: "Slow queries"
```
Solución: Agregar más índices
Ubicación: backend/src/database/init.ts

CREATE INDEX idx_products_almacen ON products(almacen);
CREATE INDEX idx_outputs_week ON outputs(week);
```

---

### 4. Problemas de API

#### Síntoma: "400 Bad Request"
```bash
# Verificar payload enviado:
# Frontend debe enviar JSON válido
# Backend valida campos requeridos

# Ejemplo correcto:
{
  "name": "Mozzarella",
  "minimumStock": 15,
  "almacen": "Pizzería"
}

# Validar tipos:
# number, string, enum
```

#### Síntoma: "401 Unauthorized"
```
Nota: Este proyecto NO tiene autenticación JWT implementada
Los endpoints no requieren token
Si fuera necesario, agregar middleware de auth
```

#### Síntoma: "500 Internal Server Error"
```bash
# Ver logs en terminal del backend
# Errores de database, validación, etc.

# Debug: Agregar console.log en controllers
console.error('Error:', error)

# Restart backend para ver logs
npm run dev
```

---

### 5. Problemas de Performance

#### Frontend Lento
```typescript
// Frontend: React Query DevTools
// Agregar en main.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// En App component:
<ReactQueryDevtools initialIsOpen={false} />

// Esto permite ver:
// - Queries activas
// - Estado del cache
// - Tiempo de respuesta
```

#### Backend Lento
```bash
# Profiles database queries
# Habilitar en backend/src/database/init.ts

db.on('profile', (sql) => {
  console.log('Query:', sql)
})

# Ver cuáles queries toman tiempo
# Considerar agregar índices
```

---

### 6. Problemas con WhatsApp

#### Síntoma: "WhatsApp link no abre"
```javascript
// Verificar format:
const url = `https://wa.me/34912345678?text=${encodeURIComponent(message)}`

// Debe:
// 1. Tener código país sin + o 00
// 2. Message estar URL encoded
// 3. Link abrirse en nueva ventana

// Test manual:
// https://wa.me/34912345678?text=Hola
```

#### Síntoma: "Mensaje aparece corrupto"
```javascript
// Problema: Caracteres especiales
// Solución: Usar encodeURIComponent()

// Frontend:
const message = "🚨 Stock bajo: Mozzarella\n\nStock: 5\nMínimo: 15"
const encoded = encodeURIComponent(message)
const url = `https://wa.me/${phone}?text=${encoded}`
```

---

### 7. Problemas de Validación

#### Salida rechazada por "area mismatch"
```javascript
// El producto tiene almacen = "Pizzería"
// Pero intentas output con areaDestino = "Heladería"

// Solución: 
// En OutputsPage, el campo areaDestino es DISABLED
// Se auto-selecciona desde el producto
// Si no funciona, el producto no está asignado correctamente
```

#### "Insufficient stock" error
```
Razón: Stock actual < cantidad solicitada
Verificar:
1. Stock mostrado en tabla es correcto?
2. Alguien más registró salida en otra pestaña?
3. Stock = 0? (recién iniciado producto)

Solución: 
1. Agregar entrada para aumentar stock
2. Usar cantidad menor
```

---

### 8. Problemas de Sesión/Auth

#### Síntoma: "Sesión se cierra inesperadamente"
```typescript
// Backend NO maneja sesiones/tokens
// Frontend usa Zustand (auth.store.ts)
// El logout es apenas local

// Para mejorar en producción:
// Agregar JWT tokens en backend
// Guardar token en localStorage
// Incluir en cada request header
```

---

### 9. Problemas de Sincronización

#### Síntoma: "Dos pestañas tienen datos diferentes"
```javascript
// React Query cachea datos
// Si editas en otra pestaña, no se sincroniza automáticamente

// Solución de frontend:
// Agregar refetch en componente
// O usar WebSockets (consideración futura)

// Actual: Manual refetch con button
<button onClick={() => queryClient.invalidateQueries()}>
  Refresh
</button>
```

---

### 10. Problemas de Deployment

#### Deploy Backend (Heroku example)
```bash
# 1. Crear app en Heroku
heroku create mi-app-backend

# 2. Configurar DATABASE_PATH
heroku config:set DATABASE_PATH=/tmp/inventory.db

# 3. Agregar Procfile en backend/
echo "web: npm start" > Procfile

# 4. Deploy
git push heroku main

# 5. Ver logs
heroku logs --tail
```

#### Deploy Frontend (Netlify example)
```bash
# 1. Build
npm run build

# 2. Variables de entorno
# VITE_API_URL=https://mi-app-backend.herokuapp.com/api

# 3. Deploy via CLI
netlify deploy --prod --dir=dist

# O via Git push si está conectado a Netlify
```

---

### 11. Limpieza y Reset

#### Reset Completo (Borrar TODO)
```bash
# Frontend
rm -rf node_modules
npm install

# Backend
cd backend
rm -rf node_modules dist data
npm install

# Verificar directorios:
ls -la backend/  # Debe estar vacío data/
```

#### Reset Solo de Datos
```bash
# Eliminar base de datos
rm -rf backend/data/inventory.db

# Reiniciar backend - crea BD vacía
npm run dev
```

#### Reset de Caché Frontend
```bash
# Clear React Query cache
# En componente:
const queryClient = useQueryClient()
queryClient.clear()

# O localStorage:
localStorage.clear()
```

---

### 12. Debug Avanzado

#### Logs Detallados Backend
```typescript
// En backend/src/index.ts

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString()
  })
  next()
})
```

#### Network Inspection Frontend
```bash
# Browser DevTools
F12 → Network tab

# Ver todas las requests a API:
- GET /api/products
- POST /api/outputs
- etc.

# Ver response:
200 OK → response preview
400 Bad Request → error message
500 Internal → error details
```

#### React Query DevTools
```typescript
// Mostrar estado del cache
// Queries activas
// Historial de queries
// Timing de requests
```

---

### 13. Checklist de Health Check

```bash
✓ Backend running (localhost:3000)
  curl http://localhost:3000/health

✓ Frontend running (localhost:5173)
  Navigate browser

✓ Database exists
  ls backend/data/inventory.db

✓ CORS enabled
  Response headers: Access-Control-Allow-Origin: *

✓ Products can be fetched
  curl http://localhost:3000/api/products

✓ Can create product
  curl -X POST http://localhost:3000/api/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","minimumStock":5,"almacen":"Pizzería"}'

✓ Frontend can see data
  Products page shows items
```

---

### 14. Documentación de Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Port in use | Otro proceso en 3000 | Cambiar puerto en .env |
| Cannot find module | npm modules no instalado | npm install |
| CORS error | Backend no hab compartir | Verificar middleware |
| Database locked | Múltiples conexiones | Reiniciar backend |
| 400 Bad Request | Payload inválido | Verificar tipos JSON |
| 404 Not Found | Endpoint no existe | Verificar ruta en backend |
| Stock validation | Stock insuficiente | Agregar entrada primero |
| Area mismatch | Producto no en área | Usar areaDestino correcto |

---

## 📞 Contacto para Support

Si ninguna solución funciona:

1. Revisar error completo en logs
2. Verificar versiones de Node/npm
3. Limpiar y reinstalar dependencias
4. Consultar documentación oficial (Express, React, Vite)
5. Crear issue en GitHub con detalles

---

**Última actualización**: Noviembre 20, 2025
**Versión**: 1.0.0
