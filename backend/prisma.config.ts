/// <reference types="node" />

// Configuración de Prisma 6/7
export default {
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL || 'file:./portfolio.db',
  },
};
