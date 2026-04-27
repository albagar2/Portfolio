# FamilyGasto - Control de Gastos Familiares Premium 🏠💎

Una aplicación full-stack premium para la gestión financiera familiar y patrimonial, diseñada para el control de múltiples propiedades, gastos recurrentes y sincronización inteligente entre aplicaciones.

## ✨ Características Especiales
- **Gestión Multi-Propiedad**: Controla gastos por vivienda (Principal, Apartamento, Chalet, etc.).
- **Sincronización Inteligente**: Integración automática con otras aplicaciones de la familia (ej. combustible).
- **Gestión de Recibos**: Sube y visualiza imágenes de tickets y facturas directamente desde el dashboard.
- **Alertas de Impuestos**: Calendario de vencimientos para IBI, contribuciones y seguros.
- **Gastos Recurrentes**: Identificación visual de gastos fijos mensuales.

---

## 🚀 Manual de Lanzamiento

### 1. Requisitos Previos
- **Node.js v18+** instalado.
- Las aplicaciones deben estar en la misma red local (normalmente `localhost`).

### 2. Preparación del Backend
Desde la carpeta `backend`:
1. Instala dependencias: `npm install`
2. Configura el archivo `.env` (basado en `.env.example`).
3. Sincroniza la base de datos (SQLite): `npx prisma migrate dev`
4. **Sembrar datos iniciales**: `npx prisma db seed`
5. Lanza el servidor: `npm run dev` (Puerto **3001**).

### 3. Preparación del Frontend
Desde la carpeta `frontend`:
1. Instala dependencias: `npm install`
2. Lanza la web: `npm run dev` (Puerto **3000**).
3. Accede a: `http://localhost:3000`

---

## 🛠️ Estructura del Proyecto
- **Backend (Clean Architecture)**:
  - `src/domain`: Entidades (Expense, Property) y Repositorios.
  - `src/application`: Casos de uso.
  - `src/infrastructure`: Implementación de Prisma, Multer (archivos) y Controladores.
- **Frontend (Next.js)**:
  - `src/app`: Dashboard premium con React Hooks y Lucide Icons.
- **uploads/**: Carpeta donde se guardan físicamente tus recibos.

---

## 🛡️ Seguridad
- **Internal Sync Key**: Solo aplicaciones autorizadas con clave secreta pueden enviar datos al sistema.
- **Filtro de Archivos**: Solo se permiten imágenes y PDFs para evitar archivos maliciosos.
- **Prisma**: Protección nativa contra inyecciones SQL.
- **Variables de Entorno**: Datos sensibles nunca se suben al repositorio.

---

## 👨‍🏫 Manual de Usuario Rápido
1. **Ver Recibos**: Haz clic en el icono verde `+` en la lista de gastos para ver el archivo adjunto.
2. **Subir Recibo**: Haz clic en el icono gris tenue `+` de cualquier gasto para subir su factura.
3. **Alertas**: Revisa la tarjeta de "Alertas Próximas" para no olvidar pagos importantes.
4. **Propiedades**: Usa el panel lateral para filtrar gastos por propiedad.
