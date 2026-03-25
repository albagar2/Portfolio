# 🏗️ Portfolio App - Plan de Implementación

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | React 18 + TypeScript + Vite | Rendimiento, tipado fuerte, HMR rápido |
| **Backend** | Node.js + Express + TypeScript | Ecosistema unificado, tipado fuerte |
| **Base de datos** | PostgreSQL + Prisma ORM | Robusto, tipado, migraciones automáticas |
| **Autenticación** | JWT + bcrypt | Estándar industria, seguro |
| **Contenedores** | Docker + Docker Compose | Despliegue reproducible |
| **Testing** | Vitest (front) + Jest (back) | Rápidos, compatibles con TS |

## Arquitectura: Clean Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend (React + TS)       │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Pages  │ │Components│ │   Services   │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
└──────────────────────┬──────────────────────┘
                       │ REST API (HTTPS)
┌──────────────────────┴──────────────────────┐
│               Backend (Express + TS)         │
│  ┌──────────────────────────────────────┐    │
│  │          Presentation Layer          │    │
│  │   Controllers / Middleware / Routes  │    │
│  ├──────────────────────────────────────┤    │
│  │          Application Layer           │    │
│  │       Use Cases / DTOs / Validators  │    │
│  ├──────────────────────────────────────┤    │
│  │           Domain Layer               │    │
│  │      Entities / Interfaces / Errors  │    │
│  ├──────────────────────────────────────┤    │
│  │        Infrastructure Layer          │    │
│  │   Prisma Repos / Auth / Config       │    │
│  └──────────────────────────────────────┘    │
└──────────────────────┬──────────────────────┘
                       │
              ┌────────┴────────┐
              │   PostgreSQL    │
              └─────────────────┘
```

## Secciones del Portfolio

1. **Hero / Landing** - Presentación personal con animaciones
2. **Sobre mí** - Bio, skills, tecnologías
3. **Proyectos** - Grid de proyectos con filtros y detalles
4. **Experiencia** - Timeline profesional
5. **Blog** - Posts técnicos (CRUD)
6. **Contacto** - Formulario con validación y rate limiting
7. **Admin Panel** - Dashboard para gestionar contenido (RBAC)

## Seguridad (OWASP Top 10)

- ✅ Helmet.js para headers HTTP seguros
- ✅ CORS configurado por whitelist
- ✅ Rate limiting por IP y endpoint
- ✅ JWT con refresh tokens y expiración corta
- ✅ bcrypt para hash de contraseñas
- ✅ Sanitización de inputs con express-validator
- ✅ Protección CSRF con tokens
- ✅ Prevención XSS con escape de salidas
- ✅ Logs estructurados sin datos sensibles (winston)
- ✅ RBAC para admin panel

## Estructura de Archivos

```
portfolio/
├── backend/
│   ├── src/
│   │   ├── domain/           # Entidades, interfaces
│   │   ├── application/      # Casos de uso, DTOs
│   │   ├── infrastructure/   # Prisma, auth, config
│   │   └── presentation/     # Controllers, routes, middleware
│   ├── prisma/               # Schema y migraciones
│   ├── tests/                # Tests unitarios e integración
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Vistas principales
│   │   ├── services/         # API calls
│   │   ├── hooks/            # Custom hooks
│   │   ├── context/          # React Context (Auth, Theme)
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utilidades
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
├── README.md
└── scripts/
    ├── setup.sh
    └── setup.bat
```
