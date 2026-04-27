# 💎 Manual de Usuario - FamilyGasto Premium

Bienvenido a **FamilyGasto**, tu ecosistema financiero de alto nivel diseñado para el control total de tu patrimonio familiar, propiedades y vehículos.

---

## 🚀 1. Inicio Rápido

Para poner en marcha todo el sistema, simplemente utiliza el archivo **`START_ALL.bat`** situado en la carpeta raíz. Esto activará:

- **Dashboard Central**: Gestión de gastos y propiedades.
- **Servidor de Sincronización**: Conexión con tu app de combustible.

---

## 🏠 2. Gestión de Propiedades

El sistema te permite segmentar tus gastos por ubicación:

- **Filtro Rápido**: En la barra lateral izquierda, bajo "Mis Casas", selecciona una propiedad (ej. Apartamento) para ver solo sus gastos asociados.
- **Alertas de Impuestos**: En el panel central, verás automáticamente los próximos vencimientos de IBI, Seguros y Contribuciones.

---

## 🧾 3. Control de Recibos y Facturas

Nunca pierdas un ticket físico:

- **Subida Directa**: Arrastra cualquier imagen o PDF a la zona de "Dropzone" en la parte inferior.
- **Vinculación**: Haz clic en el icono `+` tenue al lado de cualquier gasto reciente para adjuntarle su factura.
- **Visualización**: Los gastos con icono verde `+` ya tienen recibo. Haz clic para abrirlo en una nueva pestaña.

---

## 🚗 4. Sincronización con Gasoil App

Tu aplicación de control de combustible está conectada al sistema central:

- **Automático**: Cada vez que registres un repostaje o mantenimiento en la app de Gasoil, aparecerá en tu Dashboard de FamilyGasto bajo la categoría **"SUMINISTROS"** o **"VEHÍCULOS"**.
- **Sin Esfuerzo**: No necesitas duplicar información; el sistema se encarga de la comunicación interna.

---

## 🔍 5. Funciones Avanzadas

- **Buscador Inteligente**: Usa la barra de búsqueda superior para encontrar gastos por nombre o propiedad al instante.
- **Exportación**: Haz clic en "Exportar" para generar un resumen rápido de tus finanzas.
- **Gastos Recurrentes**: Identifica los gastos fijos mensuales mediante el icono del rayo amarillo (⚡).

---

## 🛡️ Seguridad y Mantenimiento

- **Backup**: El sistema utiliza una base de datos SQLite robusta alojada en `backend/prisma/dev.db`.
- **Privacidad**: Todos tus recibos se guardan de forma privada en la carpeta `backend/uploads/`.

---

*FamilyGasto - Diseñado para la excelencia en la gestión familiar.*
