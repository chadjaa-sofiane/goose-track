import { Button } from '@/components/button'
import { Dialog, DialogContent } from '@/components/dialog'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { deleteTask } from '@/redux/calendarSlice'
import { useEffect, useState } from 'react'

interface DeleteTaskProps {
    open: boolean
    setOpen: (open: boolean) => void
    date: string
    container: string
    taskId: string
}

const DeleteTask = ({
    open,
    setOpen,
    date,
    container,
    taskId,
}: DeleteTaskProps) => {
    const dispatch = useAppDispatch()

    const deleteTaskHandler = () => {
        dispatch(deleteTask({ date, container, taskId }))
        setOpen(false)
    }

    return (
        <Dialog open={open} setOpen={setOpen}>
            <DialogContent className="w-[20em] p-8 flex flex-col gap-y-4">
                <p className="text-xl">
                    Are you sure you want to delete this task?
                </p>
                <div className="flex justify-between ">
                    <Button onClick={deleteTaskHandler}>Delete </Button>
                    <Button
                        onClick={() => setOpen(false)}
                        className="bg-error hover:bg-error hover:bg-opacity-75"
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const UseDeleteTask = (
    props: Omit<DeleteTaskProps, 'taskId' | 'open' | 'setOpen'>
) => {
    const [open, setOpen] = useState(false)
    const [taskId, setTaskId] = useState<string | null>(null)

    const openDeleteTask = (taskId: string) => {
        setTaskId(taskId)
        setOpen(true)
    }

    useEffect(() => {
        if (open === false) {
            setTaskId(null)
        }
    }, [open])

    return {
        DeleteTask: () =>
            taskId && (
                <DeleteTask
                    taskId={taskId}
                    open={open}
                    setOpen={setOpen}
                    {...props}
                />
            ),
        openDeleteTask,
    }
}

export default DeleteTask
