import { Check, Trash } from 'lucide-react'
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
}

const Todo = ({ tasks, onRemoveTask, onToggleTaskCompleted }: TodoProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {
        tasks.map((task, index) => (
          <Card key={index} className='flex w-[400] h-[50] flex-col items-start justify-center gap-2 rounded-md border border-gray-300 p-2'>
            <div className="flex w-full items-center p-2">
              <span className={`min-w-0 flex-1 truncate ${task.completed ? "line-through text-gray-400" : ""}`}>
                {task.title}
              </span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" className="cursor-pointer" onClick={() => onRemoveTask?.(task.id)}>
                  <Trash />
                </Button>
                <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => onToggleTaskCompleted(task.id)}>
                  <Check />
                </Button>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Todo
