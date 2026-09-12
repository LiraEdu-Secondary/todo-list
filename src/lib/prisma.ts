import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * Armazena o cliente no escopo global durante o desenvolvimento.
 * O Hot Reload do Next.js reavalia módulos; sem este cache, cada recarga
 * poderia abrir uma nova conexão com o PostgreSQL.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/** Adaptador que permite ao Prisma 7 conectar-se via driver `pg`. */
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

/** Cliente Prisma compartilhado pelas rotas executadas no servidor. */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

/** Só guardamos a instância global em desenvolvimento; em produção, cada processo a gerencia. */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
