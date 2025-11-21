# 🧪 Testing Guide - StockWise AI

## Scenario de Prueba Completo (15 minutos)

### Setup Inicial
1. Backend corriendo en `http://localhost:3000`
2. Frontend corriendo en `http://localhost:5173`
3. Loguear (cualquier credencial)

---

## 📝 Test Case 1: Crear Productos

### Paso 1.1: Crear Primer Producto (Pizzería)
```
URL: /app/products
Action: Click "+ New Product"
Form:
  - Name: Mozzarella
  - Min Stock: 15
  - Area: Pizzería
Result: ✓ Producto creado, visible en tabla
```

### Paso 1.2: Crear Segundo Producto (Heladería)
```
Form:
  - Name: Vainilla
  - Min Stock: 20
  - Area: Heladería
Result: ✓ Producto creado en área diferente
```

### Paso 1.3: Crear Tercer Producto (Cocina Principal)
```
Form:
  - Name: Tomate
  - Min Stock: 5
  - Area: Cocina principal
Result: ✓ Ahora tienes 3 productos en 3 áreas
```

---

## 📥 Test Case 2: Registrar Entradas (Stock +)

### Paso 2.1: Agregar Stock a Mozzarella
```
URL: /app/inputs
Action: Click "Record Input"
Form:
  - Product: Mozzarella (Pizzería)
  - Quantity: 25
  - Note: "Compra a Proveedor A"
Result: ✓ Se registra entrada
Expected: Stock de Mozzarella = 25
```

### Paso 2.2: Verificar en Tabla
```
Action: Ir a Products
Result: ✓ Mozzarella muestra stock 25
Status: OK (verde, porque 25 > 15)
```

### Paso 2.3: Agregar Entrada a otro Producto
```
Back to Inputs → New Entry
Form:
  - Product: Vainilla (Heladería)
  - Quantity: 18
  - Note: "Stock inicial"
Result: ✓ Registrado
Expected: Vainilla stock = 18
```

---

## 📤 Test Case 3: Registrar Salidas (Stock -)

### Paso 3.1: Primera Salida Exitosa
```
URL: /app/outputs
Action: Click "Record Output"
Form:
  - Product: Mozzarella (select)
  - Quantity: 5
  - Area Destino: Auto-filled "Pizzería"
Result: ✓ Salida registrada
Expected: Mozzarella stock = 20 (25 - 5)
          Salida visible en tabla semanal
```

### Paso 3.2: Prueba de Validación - Stock Insuficiente
```
Form:
  - Product: Mozzarella (stock actual = 20)
  - Quantity: 25
Result: ✓ Error: "Insufficient stock. Available: 20"
Expected: No se permite, no cambia stock
```

### Paso 3.3: Prueba de Validación - Área Diferente
```
(Si fuera posible, pero está deshabilitada)
Form:
  - Product: Mozzarella (Pizzería)
  - Quantity: 5
  - Area Destino: Heladería (debería fallar)
Result: ✓ Botón deshabilitado (área se auto-selecciona)
```

### Paso 3.4: Varias Salidas para la Semana
```
Crear múltiples salidas:
  1. Mozzarella: 3 unidades
  2. Vainilla: 2 unidades
  3. Tomate: 4 unidades
Result: ✓ Todas registradas
Expected: Stock decrementado para cada una
```

---

## 🚨 Test Case 4: Alertas de Stock Bajo

### Paso 4.1: Crear Condición de Alerta
```
URL: /app/products
Crear nuevo producto:
  - Name: "Aceituna"
  - Min Stock: 50
  - Area: Pizzería
Result: ✓ Stock inicial = 0 (< 50)
```

### Paso 4.2: Ver Alertas
```
URL: /app/alerts
Expected: ✓ "Aceituna" aparece en lista roja
Shows:
  - Product name: Aceituna
  - Current Stock: 0
  - Minimum Required: 50
  - Deficit: 50 units
```

### Paso 4.3: Agregar más Productos en Alerta
```
Crear productos con bajo stock:
  1. "Pimienta" - Min: 30, Stock: 5
  2. "Sal" - Min: 25, Stock: 10
Result: ✓ Múltiples alertas visibles
Grouped by: Pizzería / Heladería / etc.
```

### Paso 4.4: WhatsApp Integration
```
URL: /app/alerts
Action: Click "Share" en una alerta (Aceituna)
Dialog appears:
  Phone field: Enter "+34912345678"
  Button: "Generate Message"
Action: Click "Generate Message"
Result: ✓ Message formatted:
  🚨 *Alerta de Stock*
  Producto: Aceituna
  Área: Pizzería
  Stock actual: 0
  Stock mínimo: 50
Action: Click "Open WhatsApp"
Result: ✓ Opens https://wa.me/... in new tab
```

---

## 📊 Test Case 5: Resumen Semanal

### Paso 5.1: Ver Resumen
```
URL: /app/weekly-summary
Expected: ✓ Muestra Week [número]
          Mostrar todas salidas de esta semana
```

### Paso 5.2: Verificar Agrupación por Día
```
Expected: ✓ Agrupa salidas por día (Monday, Tuesday, etc.)
          Cada día muestra:
            - Producto
            - Area
            - Cantidad
            - Hora exacta
```

### Paso 5.3: Calcular Totales Diarios
```
Expected: ✓ Cada día muestra "Daily Total: X units"
          Total de todos los días visible
```

### Paso 5.4: Reset Semanal (DESTRUCTIVO)
```
Action: Click "Reset Week"
Dialog: ⚠️ Confirmation dialog
  Warning: "This will delete all output records from previous week"
  Note: "Stock totals will NOT be affected"
Action: Click "Confirm Reset"
Result: ✓ Deletes only previous week's outputs
Expected: Current week outputs remain
          Stock values unchanged
```

---

## 🔄 Test Case 6: Editar y Eliminar

### Paso 6.1: Editar Producto
```
URL: /app/products
Action: Click Edit icon on Mozzarella
Dialog:
  - Change name: "Mozzarella (Premium)"
  - Change Min Stock: 20
Action: Save
Result: ✓ Producto actualizado
Expected: Tabla muestra nombre nuevo, min stock nuevo
```

### Paso 6.2: Eliminar Input
```
URL: /app/inputs
Action: Click Delete icon on entrada
Result: ✓ Entrada eliminada
Expected: Stock revertido (aumenta si fue entrada)
          Registra cambio en stock
```

### Paso 6.3: Eliminar Output
```
URL: /app/outputs
Action: Click Delete icon on salida
Result: ✓ Salida eliminada
Expected: Stock revertido (aumenta de vuelta)
          Ya no aparece en semanal
```

### Paso 6.4: Eliminar Producto
```
URL: /app/products
Action: Click Delete icon on Aceituna
Result: ✓ Producto eliminado
Expected: Ya no aparece en lista
          Ya no aparece en alerts
          Cascada en BD: inputs/outputs también se eliminan
```

---

## 🔐 Test Case 7: Validaciones y Edge Cases

### Validación 7.1: Campos Requeridos
```
Intentar crear producto sin nombre:
Result: ✓ Error o button deshabilitado
```

### Validación 7.2: Cantidades Negativas
```
Intentar agregar cantidad negativa:
Result: ✓ Sistema no permite o min value = 1
```

### Validación 7.3: Producto no Existe
```
Modificar URL API directamente:
Result: ✓ Error 404 manejado
```

### Validación 7.4: Stock Exacto
```
Crear salida con cantidad = stock actual:
Example: Stock = 20, Output = 20
Result: ✓ Permitido, stock final = 0
```

---

## 📱 Test Case 8: Responsividad

### Mobile (360px)
```
Check:
  - [ ] Menu se colapsa
  - [ ] Tablas scrollean horizontal
  - [ ] Diálogos adaptan tamaño
  - [ ] Botones clickeables
```

### Tablet (768px)
```
Check:
  - [ ] Layout es usable
  - [ ] Columnas apropiadas
  - [ ] Información legible
```

### Desktop (1920px)
```
Check:
  - [ ] Máximo ancho util
  - [ ] Espaciado adecuado
  - [ ] Sin overflow de contenido
```

---

## 🐛 Test Case 9: Error Handling

### Conexión 9.1: Backend No Disponible
```
Action: Detener backend
Expected: ✓ Mensaje de error en UI
          Botones deshabilitados
          Reintentos automáticos
```

### Conexión 9.2: Reconectar
```
Action: Reiniciar backend
Expected: ✓ UI se recupera
          Datos se recarga
```

### Error 9.3: Response Malformada
```
(Manual test si es necesario)
Expected: ✓ Manejo graceful de error
```

---

## ✅ Checklist de Verificación Final

```
Frontend
  ✓ Todos los botones funcionales
  ✓ Formularios validan entrada
  ✓ Tablas cargan datos correctamente
  ✓ Diálogos abren/cierran sin problemas
  ✓ Estados de carga (loading spinners) funcionan
  ✓ Mensajes de error claros
  ✓ Responsive design en mobile/tablet/desktop

Backend
  ✓ Servidor inicia sin errores
  ✓ Base de datos se crea/inicia
  ✓ Todos los endpoints responden
  ✓ Validaciones funcionan
  ✓ Cálculos de stock son correctos
  ✓ CORS habilitado correctamente
  ✓ Errores retornan status codes apropiados

Lógica de Negocio
  ✓ Entrada incrementa stock
  ✓ Salida decrementa stock
  ✓ Validación de área funciona
  ✓ Alertas se generan correctamente
  ✓ Semana se rastrea correctamente
  ✓ Reset semanal limpia datos anteriores
  ✓ WhatsApp link funciona
  ✓ Stock mínimo se respeta en alertas

Database
  ✓ Tables creadas correctamente
  ✓ Datos persisten entre sesiones
  ✓ Eliminación en cascada funciona
  ✓ Integridad referencial
  ✓ Índices optimizan queries
```

---

## 🎯 Puntuación de Éxito

```
Escala: 0-100

Perfect Execution:
  100% - Todos los tests pasan sin errores
  
Excellent:
  85% - 90% de tests pasan, bugs menores

Good:
  70% - Funcionalidad principal trabajando
  
Fair:
  50% - Problemas significativos

Needs Work:
  < 50% - Muchos bugs, lógica incorrecta
```

---

**Nota**: Este es un guía completa de testing. Ejecutar todas las pruebas te dará confianza en la estabilidad del sistema.
