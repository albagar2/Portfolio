import { PrismaClient } from '@prisma/client';
declare class Database {
    private static instance;
    /**
     * Obtiene la instancia singleton de PrismaClient
     * Aplica logging en desarrollo para depuración
     */
    static getInstance(): PrismaClient;
    /**
     * Cierra la conexión a la base de datos
     * Se usa en el shutdown graceful del servidor
     */
    static disconnect(): Promise<void>;
}
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { Database };
//# sourceMappingURL=prisma.d.ts.map