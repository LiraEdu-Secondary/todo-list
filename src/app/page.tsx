"use client"
import Todo from "@/components/todo";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus } from 'lucide-react';
import { type SubmitEvent, useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";

type Task = {
  id: string;
  title: string;
  completed: boolean;
}

const Home = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  // a tarefa que está sendo editada. null significa que o modal está fechado
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // controla o texto dentro do input do modal
  const [editTitle, setEditTitle] = useState("");
  // evita dois salvamentos simultaneos
  const [isSavingEdit, setIsSavingEdit] = useState(false);


  // Filtros
  const pendingTasks = tasks.filter((task) => !task.completed);

  const completedTasks = tasks.filter((task) => task.completed);


  // Busca as tarefas ja salvas no banco quando a pagina abre.
  // useEffect(() => {
  //   async function loadTasks() {
  //     try {
  //       const response = await fetch("/api/tasks")

  //       if (!response.ok) {
  //         throw new Error("Não foi possivel carregar as tarefas.");
  //       }

  //       const savedTasks: Task[] = await response.json();

  //       // Substitui a lista vazia inicial pelos dados do POSTGRESQL
  //       setTasks(savedTasks);
  //     } catch (error) {
  //       setError(
  //         error instanceof Error
  //           ? error.message
  //           : "Ocorreu um erro ao carregar as tarefas."
  //       )
  //     }

  //   }
  //   void loadTasks();
  // }, []);

  // Cria tarefa 
  const addTask = async () => {
    const title = newTask.trim();

    if (!title || isCreating) return;


    try {
      setIsCreating(true);
      setError("");

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          // Informa que o corpo da requisição está no formato JSON.
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error("Não foi possivel criar a tarefa.")
      }

      // A API devolve a tarefa criada, incluindo id e completed: false.
      const createdTask: Task = await response.json();

      // Atualiza tela somente depois de o banco confirmar a criação.
      setTasks((currentTask) => [createdTask, ...currentTask]);

      // Limpa o campo de texto após o sucesso.

      setNewTask("");

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar a tarefa."
      )
    } finally {
      // Reabilita o botão mesmo se a requisição falhar.
      setIsCreating(false);
    }
  }

  // Alterna o status de conclusão da tarefa no banco.
  const toggleTaskCompleted = async (idToToggle: string) => {

    // Alterna o status de conclusão da tarefa no banco.
    const task = tasks.find((currentTask) => currentTask.id === idToToggle);

    if (!task || updatingTaskId) return;

    try {
      setUpdatingTaskId(idToToggle);
      setError("");

      const response = await fetch(`/api/tasks/${idToToggle}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // Envia o oposto do estado atual: false vira true e vice-versa.
        body: JSON.stringify({
          completed: !task.completed,
        })
      })

      if (!response.ok) {
        throw new Error("Não foi possivel atualizar a tarefa.")
      }

      // A rota devolve a versão atualizada que foi efetivamente salva.
      const updatedTask: Task = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao atualizar a tarefa."
      )
    } finally {
      setUpdatingTaskId(null);
    }
  }

  // Remove tarefa
  const removeTask = (idToRemove: string) => {
    setTasks(tasks.filter((task) => task.id !== idToRemove));
  };

  // abre a modal e copia o titulo atual para o campo de edição 
  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title)
  }

  // salva o titulo da task editado
  const saveTaskEdit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = editTitle.trim();

    if (!editingTask || !title || isSavingEdit) return;

    try {
      setIsSavingEdit(true);
      setError("")

      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      })

      if (!response.ok) {
        throw new Error("Não foi possivel editar a tarefa.")
      };

      const updatedTask: Task = await response.json();

      setTasks((currentTask) =>
        currentTask.map((task) => task.id === updatedTask.id ?
          updatedTask : task
        ))

      setEditingTask(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao editar a tarefa."
      );
    } finally {
      setIsSavingEdit(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">

      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>


      <div className={`grid w-full gap-4 ${completedTasks.length > 0 ? "max-w-5xl md:grid-cols-2" : "max-w-md grid-cols-1"}`}>
        <Card className="flex w-full flex-col gap-4 p-4">
          <div className="flex w-full flex-row items-center gap-2">
            <Input
              className="min-w-0 flex-1 rounded-md border border-gray-300 p-2 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Crie sua tarefa."
            />
            <Button
              className="cursor-pointer"
              onClick={addTask}
              disabled={isCreating}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
          <Separator className="w-full" />

          {error && (
            <p className="w-full text-sm text-red-600">{error}</p>
          )}

          {pendingTasks.length > 0 ? (
            <Todo
              tasks={pendingTasks}
              onRemoveTask={removeTask}
              onToggleTaskCompleted={toggleTaskCompleted}
              updatingTaskId={updatingTaskId}
              onEditTask={openEditDialog}
            />
          ) : (
            <div className="flex min-h-24 w-full items-center justify-center rounded-md border border-dashed border-gray-300 px-4 text-center">
                <p className="text-sm text-gray-500">
                  {
                    tasks.length === 0 
                      ? "Adicione suas tarefas para começar."
                      : "Todas as tarefas foram concluídas."

                  }
              </p>
            </div>
          )}

          <Dialog
            open={editingTask !== null}
            onOpenChange={(open) => {
              if (!open && !isSavingEdit) {
                setEditingTask(null)
              }
            }}
          >
            <DialogContent>
              <form onSubmit={saveTaskEdit}>
                <DialogHeader>
                  <DialogTitle>
                    Editar Tarefa
                  </DialogTitle>

                  <div className="mt-4 space-y-2">
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={(event) =>
                        setEditTitle(event.target.value)}
                      disabled={isSavingEdit}
                      autoFocus
                    />
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingTask(null)}
                      disabled={isSavingEdit}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSavingEdit || !editTitle.trim()}>
                      {isSavingEdit ? "Salvando..." : "Salvar"}
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </form>
            </DialogContent>
          </Dialog>


        </Card>

        {/* Renderiza somente se existir uma task com status completed */}
        {
          completedTasks.length > 0 && (
            <Card className="flex w-full flex-col gap-4 p-4">
              <h2 className="mb-4 text-lg font-semibold">Tarefas concluídas</h2>
              <Todo
                tasks={completedTasks}
                onToggleTaskCompleted={toggleTaskCompleted}
                updatingTaskId={updatingTaskId}
                onEditTask={openEditDialog}
                showRemoveButton={false}
                showCompleteButton={false}
              />
            </Card>
          )

        }
      </div>
    </main>
  );
}

export default Home
