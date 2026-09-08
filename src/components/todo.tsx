import { Check, Trash } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'

type TodoProps = {
  tasks: string[]
}

const Todo = ({ tasks }: TodoProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {
        tasks.map((task, index) => (
          <Card key={index} className='flex w-[400] h-[50] flex-col items-start justify-center gap-2 rounded-md border border-gray-300 p-2'>
            <div className="flex w-full items-center p-2">
              <span className="min-w-0 flex-1 truncate">
                {task}
              </span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" className="cursor-pointer"><Trash /></Button>
                <Button size="sm" variant="ghost" className="cursor-pointer"><Check /></Button>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Todo
