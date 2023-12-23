import React, { forwardRef, useId, useState } from 'react'
import { Button } from '@/components/button'
import { Dialog, DialogContent } from '@/components/dialog'
import CloseIcon from '@/features/dashboard/assets/close.svg?react'
import { InputField } from '@/components/inputField'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'

const AddTask = () => {
    const [open, setOpen] = useState(false)
    const { register } = useForm({
        defaultValues: {
            title: '',
            start: `00:00`,
            end: `23:59`,
        },
    })

    return (
        <>
            <Button onClick={() => setOpen(true)}> Add Task</Button>
            <Dialog open={open} setOpen={setOpen}>
                <DialogContent className="relative w-[24.75em] px-7 py-10 flex flex-col gap-y-8">
                    <div className="absolute right-3.5 top-3.5 flex justify-end cursor-pointer">
                        <CloseIcon
                            onClick={() => setOpen(false)}
                            className="hover:scale-110 origin-center duration-75"
                        />
                    </div>
                    <div className="flex flex-col gap-y-[1.125em]">
                        <div>
                            <InputField label="title" {...register('title')} />
                        </div>
                        <div className="flex gap-x-3.5">
                            <InputField
                                type="time"
                                label="start"
                                {...register('start')}
                                className="flex-1"
                            />
                            <InputField
                                type="time"
                                label="end"
                                {...register('end')}
                                className="flex-1"
                            />
                        </div>
                        <div className="flex gap-x-4">
                            <PriorityRadio name="priority" label="low" />
                            <PriorityRadio name="priority" label="medium" />
                            <PriorityRadio name="priority" label="high" />
                        </div>
                    </div>

                    <div className="flex justify-between gap-x-3.5">
                        <Button className="flex-1 grid place-items-center">
                            {' '}
                            add{' '}
                        </Button>
                        <Button className="bg-white text-[#111] hover:bg-white hover:bg-opacity-5 hover:text-white flex-1 grid place-items-center">
                            {' '}
                            cancel{' '}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

interface PriorityRadio extends React.ComponentPropsWithoutRef<'input'> {
    label: 'low' | 'medium' | 'high'
    name: string
    defaultChecked?: boolean
}

const PriorityRadio = forwardRef<HTMLInputElement, PriorityRadio>(
    ({ label, name, defaultChecked = false, ...rest }, ref) => {
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

export default AddTask
