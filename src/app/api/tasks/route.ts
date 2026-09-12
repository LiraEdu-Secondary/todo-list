import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/tasks
 *
 * Retorna todas as tarefas, das mais recentes para as mais antigas.
 * Esta rota é chamada pelo navegador quando a página é aberta.
 */
export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // NextResponse.json serializa o resultado e responde com HTTP 200.
  return NextResponse.json(tasks);
}

/**
 * POST /api/tasks
 *
 * Cria uma tarefa a partir do corpo JSON `{ title: string }` enviado pelo frontend.
 */
export async function POST(request: Request) {
  // Converte o corpo da requisição de JSON para um objeto JavaScript.
  const body = await request.json();

  // Garante que title é texto e remove espaços antes e depois dele.
  const title = typeof body.title === "string" ? body.title.trim() : "";

  // A API valida os dados independentemente do que a interface permita digitar.
  if (!title) {
    return NextResponse.json(
      { error: "O título da tarefa é obrigatório." },
      { status: 400 },
    );
  }

  // Insere a tarefa no PostgreSQL por meio do Prisma Client.
  const task = await prisma.task.create({
    data: {
      title,
      // O schema atual exige description; até a interface incluí-la, salvamos texto vazio.
      description: "",
    },
  });

  // HTTP 201 informa que um novo recurso foi criado com sucesso.
  return NextResponse.json(task, { status: 201 });
}
