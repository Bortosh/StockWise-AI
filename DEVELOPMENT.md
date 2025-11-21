# StockWise AI - Inventariado

Sistema de gestión de inventario web para empresas con múltiples áreas operativas.

## 🏗️ Estructura del Proyecto

```
StockWise-AI/
├── frontend/              # React + Vite + TailwindCSS
│   ├── src/
│   └── package.json
├── backend/               # Express + Node.js + SQLite
│   ├── src/
│   ├── package.json
│   └── .env
└── package.json (root)
```

## 🔥 Características

### Áreas de Negocio
- Pizzería
- Heladería
- Cocina principal
- Don Antonio

### Funcionalidades

#### 📦 Productos
- Crear, actualizar, eliminar productos
- Asignar productos a áreas específicas
- Definir stock mínimo por producto
- Vista agrupada por área

#### 📥 Entradas (Inputs)
- Registrar entrada de stock
- Agregar notas
- Historial de entradas

#### 📤 Salidas (Outputs)
- Registrar salida de stock
- Sistema semanal (lunes-domingo)
- Validación de área de distribución
- Reseteo automático cada lunes

#### 🚨 Alertas de Stock
- Generación automática de alertas cuando stock < stock mínimo
- Compartir alertas vía WhatsApp
- Vista de alertas por área
- Resumen de alertas

#### 📊 Vista Semanal
- Visualizar todas las salidas de la semana actual
- Agrupar por día
- Estadísticas semanales

## 🚀 Configuración e Instalación

### Requisitos previos
- Node.js >= 16
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd StockWise-AI
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno (Backend)

Crear archivo `.env` en la carpeta `backend/`:
```
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/inventory.db
```

### 4. Instalar dependencias del frontend
```bash
cd ..
npm install
```

### 5. Configurar variables de entorno (Frontend)

Crear archivo `.env` en la raíz del proyecto:
```
VITE_API_URL=http://localhost:3000/api
VITE_USE_API=true
```

## 🎯 Ejecución

### Opción 1: Ejecutar por separado (Recomendado para desarrollo)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El servidor estará en: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
La aplicación estará en: `http://localhost:5173`

### Opción 2: Construir para producción

**Backend:**
```bash
cd backend
npm run build
npm run start
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener un producto
- `GET /api/products/area/:almacen` - Obtener productos por área
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Inputs
- `GET /api/inputs` - Listar todas las entradas
- `GET /api/inputs/by-date-range?startDate=...&endDate=...` - Filtrar por fecha
- `POST /api/inputs` - Registrar entrada
- `DELETE /api/inputs/:id` - Eliminar entrada

### Outputs
- `GET /api/outputs` - Listar todas las salidas
- `GET /api/outputs/weekly` - Obtener salidas de la semana actual
- `GET /api/outputs/weekly-summary` - Resumen detallado de la semana
- `GET /api/outputs/by-date-range?startDate=...&endDate=...` - Filtrar por fecha
- `POST /api/outputs` - Registrar salida
- `DELETE /api/outputs/:id` - Eliminar salida
- `DELETE /api/outputs/reset/weekly` - Resetear semana anterior

### Alerts
- `GET /api/alerts` - Obtener todas las alertas
- `GET /api/alerts/summary` - Resumen de alertas por área
- `GET /api/alerts/by-area/:almacen` - Alertas de un área específica
- `POST /api/alerts/format-whatsapp` - Generar mensaje WhatsApp

## 🗄️ Base de Datos

Utiliza **SQLite** para almacenamiento local. La base de datos se crea automáticamente en `./data/inventory.db` al iniciar el backend.

### Tablas
- `products` - Información de productos
- `inputs` - Registros de entrada de stock
- `outputs` - Registros de salida de stock

## 🔐 Autenticación

Actualmente utiliza un sistema básico de login. Para producción, se recomienda:
- Implementar JWT
- Usar OAuth
- Integrar con sistemas de autenticación corporativos

## 📝 Notas de Desarrollo

### Lógica de Negocio Importante
1. **Un producto solo puede distribuirse dentro de su área** - El campo `areaDestino` debe coincidir con `almacen`
2. **Stock no se reinicia** - Solo los registros de salida se limpian cada lunes
3. **Alertas automáticas** - Se generan en tiempo real cuando `stock < minimumStock`
4. **Número de semana** - Se calcula automáticamente para control de semanas operativas

### Mejoras Futuras
- [ ] Autenticación con JWT
- [ ] Reportes PDF/Excel
- [ ] Gráficos de tendencias
- [ ] Integración con proveedores
- [ ] Sistema de permisos por rol
- [ ] Historial de cambios de stock
- [ ] Notificaciones automáticas
- [ ] API de recetas/combinaciones de productos

## 🤝 Contribuir

Para contribuir al proyecto:
1. Crear una rama feature: `git checkout -b feature/nombre`
2. Hacer commit de cambios: `git commit -am 'Descripción'`
3. Push a la rama: `git push origin feature/nombre`
4. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y propiedad de [Empresa].

## 📧 Soporte

Para soporte técnico, contactar a: support@stockwise.local
