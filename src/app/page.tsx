"use client"
import Todo from "@/components/todo";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@base-ui/react"
import { Plus } from 'lucide-react';
import { useEffect, useState } from "react";

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
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  // Busca as tarefas ja salvas no banco quando a pagina abre.
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks")

        if (!response.ok) {
          throw new Error("Não foi possivel carregar as tarefas.");
        }

        const savedTasks: Task[] = await response.json();

        // Substitui a lista vazia inicial pelos dados do POSTGRESQL
        setTasks(savedTasks);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao carregar as tarefas."
        )
      }

    }
    void loadTasks();
  }, []);


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

      const createdTask: Task = await response.json();

      setTasks((currentTask) => [createdTask, ...currentTask]);

      setNewTask("");

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar a tarefa."
      )
    } finally {
      setIsCreating(false);
    }
  }


  // Remove tarefa
  const removeTask = (idToRemove: string) => {
    setTasks(tasks.filter((task) => task.id !== idToRemove));
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="flex w-full max-w-md flex-col items-center gap-4">
        <CardContent className="flex w-full flex-row items-center gap-2">
          <Input
            className="min-w-0 flex-1 rounded-md border border-gray-300 p-2 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Crie sua tarefa."
          />
          <Button className="cursor-pointer" onClick={addTask}>
            <Plus className="h-6 w-6" />
          </Button>
        </CardContent>
        <Separator className="w-100!" />

        <Todo tasks={tasks} onRemoveTask={removeTask} onToggleTaskCompleted={toggleTaskCompleted} />
      </Card>
    </main>
  );
}

export default Home
