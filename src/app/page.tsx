"use client"
import Todo from "@/components/todo";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@base-ui/react"
import { Plus } from 'lucide-react';
import { useState } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
}

const Home = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Adiciona nova tarefa
  const addTask = () => {
    const task = newTask.trim();

    if (!task) return;

    setTasks([...tasks, {
      id: crypto.randomUUID(),
      title: task,
      completed: false
    }]);

    setNewTask("");
  };

  // Remove tarefa
  const removeTask = (idToRemove: string) => {
    setTasks(tasks.filter((task) => task.id !== idToRemove));
  };


  const toggleTaskCompleted = (idToToggle: string) => {
    setTasks(tasks.map((task) => task.id === idToToggle ? { ...task, completed: !task.completed } : task));
  }


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
