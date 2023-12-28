import React, { forwardRef, useEffect, useId, useState } from 'react'
import { Button } from '@/components/button'
import { Dialog, DialogContent } from '@/components/dialog'
import CloseIcon from '@/features/dashboard/assets/close.svg?react'
import { InputField } from '@/components/inputField'
import { type UseFormReset, useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/hooks/reduxHooks'
import {
    TaskFormReducerPayload,
    addTask,
    priorites,
} from '@/redux/calendarSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskFormFields, taskFormSchema } from '@/api/calendarApi'
import PlusIcon from '@/assets/plus.svg?react'

interface TaskFormProps {
    container: string
    date: string
    title: string
    onSumbit: (
        inputs: TaskFormReducerPayload,
        reset: UseFormReset<TaskFormFields>
    ) => void
    defaultFields?: TaskFormFields
}

const TaskForm = ({
    container,
    date,
    title,
    onSumbit,
    defaultFields,
}: TaskFormProps) => {
    const [open, setOpen] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        getValues,
        reset,
        setFocus,
    } = useForm<TaskFormFields>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: defaultFields || {
            title: '',
            start: '00:00',
            end: '23:59',
            priority: priorites[0],
        },
    })

    const addTaskHandler = (data: TaskFormFields) => {
        const priority = getValues().priority
        onSumbit({ container, date, ...data, priority }, reset)
        setOpen(false)
    }

    useEffect(() => {
        setFocus('title')
    }, [setFocus])

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                icons={{
                    start: <PlusIcon />,
                }}
                className="w-full flex items-center justify-center gap-x-2"
            >
                Add Task
            </Button>
            <Dialog open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(addTaskHandler)}>
                    <DialogContent className="relative w-[24.75em] px-7 py-10 flex flex-col gap-y-8">
                        <div>{title}</div>
                        <div className="absolute right-3.5 top-3.5 flex justify-end cursor-pointer">
                            <CloseIcon
                                onClick={() => setOpen(false)}
                                className="hover:scale-110 origin-center duration-75"
                            />
                        </div>
                        <div className="flex flex-col gap-y-[1.125em]">
                            <div>
                                <InputField
                                    label="title"
                                    {...register('title')}
                                    status={
                                        errors['title']
                                            ? 'error'
                                            : touchedFields['title']
                                            ? 'done'
                                            : 'normal'
                                    }
                                    message={
                                        errors['title']
                                            ? errors['title']?.message
                                            : ''
                                    }
                                />
                            </div>
                            <div className="flex gap-x-3.5">
                                <InputField
                                    type="time"
                                    label="start"
                                    {...register('start')}
                                    status={
                                        errors['start']
                                            ? 'error'
                                            : touchedFields['start']
                                            ? 'done'
                                            : 'normal'
                                    }
                                    message={
                                        errors['start']
                                            ? errors['start']?.message
                                            : ''
                                    }
                                    className="flex-1"
                                />
                                <InputField
                                    type="time"
                                    label="end"
                                    {...register('end')}
                                    status={
                                        errors['end']
                                            ? 'error'
                                            : touchedFields['end']
                                            ? 'done'
                                            : 'normal'
                                    }
                                    message={
                                        errors['end']
                                            ? errors['end']?.message
                                            : ''
                                    }
                                    className="flex-1"
                                />
                            </div>
                            <div className="flex gap-x-4">
                                <PriorityRadio
                                    {...register('priority')}
                                    label="low"
                                    value="low"
                                />
                                <PriorityRadio
                                    {...register('priority')}
                                    label="medium"
                                    value="medium"
                                />
                                <PriorityRadio
                                    {...register('priority')}
                                    label="high"
                                    value="high"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between gap-x-3.5">
                            <Button
                                type="submit"
                                className="flex-1 grid place-items-center"
                            >
                                add
                            </Button>
                            <Button
                                type="button"
                                className="bg-white text-[#111] hover:bg-white hover:bg-opacity-5 hover:text-white flex-1 grid place-items-center"
                            >
                                cancel
                            </Button>
                        </div>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    )
}

interface PriorityRadio extends React.ComponentPropsWithoutRef<'input'> {
    label: (typeof priorites)[number]
    name: string
    defaultChecked?: boolean
    value: (typeof priorites)[number]
}

export const PriorityRadio = forwardRef<HTMLInputElement, PriorityRadio>(
    ({ label, name, defaultChecked = false, value, ...rest }, ref) => {
        const id = useId()
        return (
            <label
                htmlFor={id}
                className="flex gap-x-2 items-center cursor-pointer"
            >
                <input
                    ref={ref}
                    type="radio"
                    name={name}
                    id={id}
                    defaultChecked={defaultChecked}
                    {...rest}
                    className="peer/priority"
                    value={value}
                    hidden
                />
                <div
                    className={cn(
                        'w-3 h-3 rounded-full priority:bg-red-400 border-2 ',
                        {
                            'border-priorities-low peer-checked/priority:bg-priorities-low':
                                label === 'low',
                            'border-priorities-medium peer-checked/priority:bg-priorities-medium':
                                label === 'medium',
                            'border-priorities-high peer-checked/priority:bg-priorities-high':
                                label === 'high',
                        }
                    )}
                />
                <div className="first-letter:uppercase font-semibold">
                    {label}
                </div>
            </label>
        )
    }
)

export const AddTask = (props: Omit<TaskFormProps, 'onSumbit'>) => {
    const dispatch = useAppDispatch()
    const addTaskHundler: TaskFormProps['onSumbit'] = (inputs, reset) => {
        const { container, date, ...data } = inputs
        dispatch(addTask({ container, date, ...data }))
        reset()
    }
    return <TaskForm {...props} onSumbit={addTaskHundler} />
}

export default TaskForm
