import { Button } from '@/components/button'
import { Dialog, DialogContent } from '@/components/dialog'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { deleteTaskById, isPersistedTaskId } from '@/api/calendarApi'
import { useToast } from '@/components/toast/toastProvider'
import { Task, TasksDate, deleteTask, restoreTask } from '@/redux/calendarSlice'
import { useEffect, useState } from 'react'

interface DeleteTaskProps {
    open: boolean
    setOpen: (open: boolean) => void
    date: TasksDate
    container: string
    taskId: string
    task?: Task
}

const DeleteTask = ({
    open,
    setOpen,
    date,
    container,
    taskId,
    task,
}: DeleteTaskProps) => {
    const dispatch = useAppDispatch()
    const { pushToast } = useToast()

    const deleteTaskHandler = async () => {
        dispatch(deleteTask({ date, container, taskId }))
        if (isPersistedTaskId(taskId)) {
            try {
                const result = await deleteTaskById(taskId)
                if (!result.success && task) {
                    dispatch(restoreTask({ date, container, task }))
                    pushToast('Delete failed. Task was restored.', 'error')
                }
            } catch {
                if (task) {
                    dispatch(restoreTask({ date, container, task }))
                    pushToast('Delete failed. Task was restored.', 'error')
                }
            }
        }
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
    const [task, setTask] = useState<Task | undefined>(undefined)

    const openDeleteTask = (taskId: string, task?: Task) => {
        setTaskId(taskId)
        setTask(task)
        setOpen(true)
    }

    useEffect(() => {
        if (open === false) {
            setTaskId(null)
            setTask(undefined)
        }
    }, [open])

    return {
        DeleteTask: () =>
            taskId && (
                <DeleteTask
                    taskId={taskId}
                    task={task}
                    open={open}
                    setOpen={setOpen}
                    {...props}
                />
            ),
        openDeleteTask,
    }
}

export default DeleteTask
