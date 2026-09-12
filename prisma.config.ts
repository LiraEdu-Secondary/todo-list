import "dotenv/config";
import { defineConfig } from "prisma/config";

// Configuração usada pelos comandos do Prisma CLI, como migrate e generate.
export default defineConfig({
  // Local do schema que descreve os modelos e o banco.
  schema: "prisma/schema.prisma",
  migrations: {
    // Pasta onde cada alteração versionada na estrutura do banco é salva.
    path: "prisma/migrations",
  },
  datasource: {
    // Lê a conexão do .env, mantendo usuário e senha fora do código-fonte.
    url: process.env["DATABASE_URL"],
  },
});
