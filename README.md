<div align="center">

# ⚡ Alba García López — Portfolio Full-Stack

[![CI Pipeline](https://github.com/albagar2/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/albagar2/Portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)

**Portfolio Profesional Full-Stack desarrollado con React 18, TypeScript, Node.js, Express, Prisma ORM y Docker.**

[🚀 Ver en vivo](https://albagarcia-portfolio.vercel.app) • [📄 Descargar CV](#) • [📐 Arquitectura](#-arquitectura-técnica) • [⚡ Inicio Rápido](#-inicio-rápido)

</div>

---

## 🌟 Características Principales

- **🌐 Multilenguaje Nativo (ES / EN)**: Conmutación instantánea de idiomas manteniendo sincronía completa de la aplicación.
- **🎨 Diseño Futurista & Responsive**: Interfaz moderna basada en TailwindCSS, Framer Motion y componentes translúcidos.
- **🔐 Panel de Administración (CMS)**: Gestión en tiempo real de proyectos, publicaciones de blog, experiencia laboral y mensajes de contacto con autenticación basada en tokens JWT.
- **🛡️ Seguridad & Clean Architecture**: Sanitización XSS (Zod DTOs), limitación de peticiones (Rate Limiting), Helmet headers y separación estricta por capas.
- **🧪 Integración Continua (CI/CD)**: Pruebas automáticas con Jest y Vitest vinculadas a GitHub Actions.

---

## 🏛️ Arquitectura Técnica

```mermaid
graph TD
    subgraph Frontend [Frontend (React 18 + Vite)]
        UI[Componentes React] --> State[Context API & TanStack Query]
        State --> i18n[Traducción Dinámica ES/EN]
        UI --> Style[TailwindCSS + Framer Motion]
    end

    subgraph Backend [Backend API (Node.js + Express)]
        API[Express Router] --> DTO[Validación Zod DTOs]
        DTO --> Auth[JWT Auth Middleware]
        Auth --> Service[Capa de Aplicación / Servicios]
        Service --> Prisma[Prisma ORM]
    end

    subgraph Database [Capa de Datos]
        Prisma --> DB[(PostgreSQL / SQLite)]
    end

    Frontend <-->|REST API / Axios| Backend
```

---

## 🛠️ Tech Stack

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Lucide Icons, Recharts |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, Zod, JWT, bcryptjs, Helmet |
| **Bases de Datos** | PostgreSQL (Producción), SQLite (Desarrollo local / Zero-Config) |
| **DevOps & CI/CD** | Docker, Docker Compose, GitHub Actions, Vercel |

---

## ⚡ Inicio Rápido

### Prerrequisitos
- Node.js (v20 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/albagar2/Portfolio.git
cd Portfolio
```

### 2. Instalación y ejecución del Frontend
```bash
cd frontend
npm install
npm run dev
```
Accede a la aplicación en `http://localhost:5173`.

### 3. Instalación y ejecución del Backend
```bash
cd ../backend
npm install
npx prisma generate
npm run dev
```
La API REST estará disponible en `http://localhost:4000/api`.

### 4. Despliegue con Docker Compose (Opcional)
```bash
docker-compose up --build -d
```

---

## 🧪 Pruebas Automáticas

Ejecución de tests unitarios e integración:

```bash
# Frontend (Vitest)
cd frontend
npm test

# Backend (Jest)
cd backend
npm test
```

---

<div align="center">

© 2026 **Alba García López** — Desarrolladora Full-Stack

</div>
