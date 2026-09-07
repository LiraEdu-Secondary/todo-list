import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@base-ui/react"
import { ListTodo, Check, Plus, Trash } from 'lucide-react';
const Home = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="flex w-full max-w-md flex-col items-center gap-4">
        <CardContent className="flex w-full flex-row items-center gap-2">
          {/* <ListTodo className="h-6 w-6" /> */}
          <Input
            className="min-w-0 flex-1 rounded-md border border-gray-300 p-2 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            placeholder="Crie sua tarefa."
          />
          <Button className="cursor-pointer"><Plus className="h-6 w-6" /></Button>
        </CardContent>
        <Separator className="w-100! " />

        <Card className="flex w-[400] h-[50] flex-col items-start justify-center gap-2 rounded-md border border-gray-300 p-2">
          <div className="flex w-full items-center">
            <span className="min-w-0 flex-1 truncate">
              estudar react
            </span>
            <div className="ml-auto flex gap-2">
              <Button size="sm" className="cursor-pointer"><Trash /></Button>
              <Button size="sm" variant="ghost" className="cursor-pointer"><Check /></Button>
            </div>
          </div>
        </Card>
      </Card>
    </main>
  )
}

export default Home