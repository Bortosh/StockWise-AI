# 🚀 Quick Start Guide

## Inicio Rápido (5 minutos)

### Paso 1: Instalar Backend
```bash
cd backend
npm install
```

### Paso 2: Instalar Frontend
```bash
cd ..
npm install
```

### Paso 3: Terminal 1 - Iniciar Backend
```bash
cd backend
npm run dev
```
✅ Backend corriendo en `http://localhost:3000`

### Paso 4: Terminal 2 - Iniciar Frontend
```bash
npm run dev
```
✅ Frontend disponible en `http://localhost:5173`

### Paso 5: Abrir en Navegador
```
http://localhost:5173
```

Login credentials (ajustar según tu auth store):
- Email: cualquier email
- Password: cualquier contraseña

## 🎮 Flujo de Prueba

### 1. Crear Productos
1. Ir a: `/app/products`
2. Click: "+ New Product"
3. Llenar:
   - Name: "Mozzarella"
   - Min Stock: 10
   - Area: "Pizzería"
4. Repetir para otros productos en diferentes áreas

### 2. Registrar Entrada (Stock +)
1. Ir a: `/app/inputs`
2. Click: "Record Input"
3. Seleccionar producto y cantidad
4. Guardar

✅ Stock del producto aumenta

### 3. Registrar Salida (Stock -)
1. Ir a: `/app/outputs`
2. Click: "Record Output"
3. Seleccionar producto y cantidad
4. El área se auto-selecciona (no editable)
5. Guardar

✅ Stock del producto disminuye
✅ Se registra en historial semanal

### 4. Ver Alertas
1. Ir a: `/app/alerts`
2. Crear un producto con stock bajo
3. Deberías ver alerta roja

🔄 Click "Share" → Ingresar número telefónico → "Generate Message" → "Open WhatsApp"

### 5. Ver Resumen Semanal
1. Ir a: `/app/weekly-summary`
2. Ver todos los movimientos de la semana
3. Agrupados por día
4. Botón "Reset Week" limpia salidas de semana anterior

## 📋 Checklists de Validación

### ✓ Validaciones Implementadas

**Products**
- [ ] No permite crear sin nombre
- [ ] Solo se distribuye dentro de su área
- [ ] Muestra indicador de stock bajo

**Inputs**
- [ ] Requiere producto y cantidad > 0
- [ ] Incrementa stock correctamente
- [ ] Se puede revertir

**Outputs**
- [ ] Valida que haya stock suficiente
- [ ] Valida que área coincida con producto
- [ ] Decrementa stock correctamente
- [ ] Se agrupa por semana

**Alerts**
- [ ] Se genera cuando stock < minimumStock
- [ ] Se muestra por área
- [ ] Se puede compartir por WhatsApp

**Weekly Summary**
- [ ] Agrupa salidas por día
- [ ] Muestra hora exacta
- [ ] Permite resetear semana
- [ ] Confirma antes de resetear

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar puerto 3000 esté libre
# Limpiar carpeta node_modules
rm -rf backend/node_modules
cd backend
npm install
npm run dev
```

### Frontend no conecta a Backend
```bash
# Verificar .env tiene:
VITE_API_URL=http://localhost:3000/api
VITE_USE_API=true

# Verificar backend esté corriendo
# Limpiar cache:
npm run dev -- --reset-cache
```

### Base de datos corrupta
```bash
# Eliminar BD y recrear:
rm -rf backend/data/inventory.db
npm run dev
```

## 📱 API Base Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Actualizar |
| DELETE | `/api/products/:id` | Eliminar |
| POST | `/api/inputs` | Registrar entrada |
| POST | `/api/outputs` | Registrar salida |
| GET | `/api/outputs/weekly` | Salidas semana |
| GET | `/api/alerts` | Alertas activas |
| DELETE | `/api/outputs/reset/weekly` | Reset semanal |

## 💡 Tips de Desarrollo

### Debug en Backend
```typescript
// Backend logs automáticos en console
console.log('Debug:', variable)
```

### Debug en Frontend
```typescript
// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

### Modificar tipos
- Frontend: `src/core/types.ts`
- Backend: `backend/src/types.ts`

### Agregar nuevas rutas
1. Crear controlador en `backend/src/controllers/`
2. Crear rutas en `backend/src/routes/`
3. Importar en `backend/src/index.ts`
4. Crear hooks en `src/features/*/services/*.hooks.ts`
5. Crear página en `src/features/*/ui/*.tsx`

## 📞 Soporte

Para issues:
1. Verificar logs en terminal
2. Verificar .env files
3. Verificar puerto 3000 disponible
4. Revisar CORS en backend

---

**¡Listo! El sistema está funcionando.**

Próximo paso: Explorar la interfaz y familiarizarse con el flujo.
