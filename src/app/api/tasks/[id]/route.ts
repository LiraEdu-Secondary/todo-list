import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * PATCH /api/tasks/:id
 *
 * Atualiza o status de conclusão de uma tarefa. O corpo esperado é
 * `{ completed: boolean }` e o id vem do segmento dinâmico da URL.
 */
export async function PATCH(
  request: Request,
  context: RouteContext<"/api/tasks/[id]">,
) {
  // No Next.js 16, os parâmetros de rota são assíncronos.
  const { id } = await context.params;
  // Lê o novo estado que o frontend solicitou salvar.
  const body = await request.json();

  // Guarda somente os campos validos que devem ser alterados.
  const data: {
    title?: string;
    completed?: boolean
  } = {};


  // Evita gravar formatos inválidos, como "true" (texto) em vez de true (booleano).
  if ("completed" in body) {
    if (typeof body.completed !== "boolean") {
      return NextResponse.json(
        { error: "O campo completed deve ser true ou false." },
        { status: 400 },
      );
    }

    data.completed = body.completed;
  }


  // Se o frontend enviou title, ele dever ser texto não vazio.
  if ("title" in body) {
    if (typeof body.title !== "string") {
      return NextResponse.json(
        { error: "O titulo da tarefa é obrigatorio." },
        { status: 400 },
      );
    }

    data.title = body.title.trim();
  }

  // Impede requisições vazias, como PATCH com `{}`.
  // if (Object.keys(data).length === 0) {
  //   return NextResponse.json(
  //     { error: "Envie title ou completed para atualizar a tarefa." },
  //     { status: 400 },
  //   );
  // }

  // Confirma a existência antes da atualização para devolver um 404 claro.
  const existingTask = await prisma.task.findUnique({ where: { id } });

  if (!existingTask) {
    return NextResponse.json(
      { error: "Tarefa não foi encontrada." },
      { status: 404 },
    );
  }

  // Atualiza apenas o campo completed, mantendo os demais dados intactos.
  const task = await prisma.task.update({
    where: { id },
    data,
  });

  // Responde com a versão atualizada, que será usada para atualizar o estado React.
  return NextResponse.json(task);
}

/**
 * DELETE /api/tasks/:id
 *
 * Remove definitivamente uma tarefa identificada pelo id na URL.
 */
export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/tasks/[id]">,
) {
  const { id } = await context.params;

  // Confirma a existência antes de tentar excluir, para retornar 404 quando necessário.
  const existingTask = await prisma.task.findUnique({ where: { id } });

  if (!existingTask) {
    return NextResponse.json(
      { error: "Tarefa não foi encontrada." },
      { status: 404 },
    );
  }

  // Exclui o registro da tabela Task.
  await prisma.task.delete({
    where: { id },
  });

  // HTTP 204 confirma sucesso e, por convenção, não possui corpo de resposta.
  return new NextResponse(null, { status: 204 });
}
