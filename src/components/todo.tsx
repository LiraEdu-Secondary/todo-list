import { Check, Pencil, Trash } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type TodoProps = {
  tasks: Task[]
  onRemoveTask?: (id: string) => void;
  onToggleTaskCompleted: (id: string) => void;
  onEditTask: (task: Task) => void;
  updatingTaskId?: string | null;
  showRemoveButton?: boolean;
  showCompleteButton?: boolean;
}

const Todo = ({ tasks, onRemoveTask, onToggleTaskCompleted, updatingTaskId, onEditTask, showRemoveButton = true, showCompleteButton = true }: TodoProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {
        tasks.map((task) => (
          <Card
            key={task.id}
            className="w-full rounded-md border border-gray-300 p-4"
          >
            <div className="flex w-full items-center gap-3">
              <div className="min-w-0 flex-1">
                <p
                  className={`font-extrabold ${task.completed ? "line-through text-gray-400" : ""
                    }`}
                >
                  {task.title}
                </p>

              </div>

              <div className="flex shrink-0 gap-2">
                {showRemoveButton && (
                  <Button
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => onRemoveTask?.(task.id)}
                    aria-label={`Excluir tarefa ${task.title}`}
                  >
                    <Trash />
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() => onEditTask(task)}
                  aria-label={`Editar tarefa ${task.title}`}
                >
                  <Pencil />
                </Button>

                {showCompleteButton && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => onToggleTaskCompleted(task.id)}
                    disabled={updatingTaskId === task.id}
                    aria-label={`Concluir tarefa ${task.title}`}
                  >
                    <Check />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Todo
