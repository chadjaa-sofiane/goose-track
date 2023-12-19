import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { cn, debounce, getDaysOfWeek } from '@/lib/utils'
import {
    WEEK_DAYS,
    markTaskAsDone,
    markTaskAsInProgress,
    markTaskAsToDo,
} from '@/redux/calendarSlice'
import PlusIcon from '@/assets/plus.svg?react'
import { Button } from '@/components/button'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import {
    DndContext,
    useDraggable,
    DragStartEvent,
    DragEndEvent,
    useDroppable,
} from '@dnd-kit/core'
import { Task } from '@/redux/calendarSlice'

const CalendarDay = () => {
    return (
        <div className="w-full flex-1 flex flex-col gap-y-4">
            <WeekDaysField />
            <TasksSpaceContainer />
        </div>
    )
}

const WeekDaysField = () => {
    const date = useAppSelector((state) => state.calendar.date)
    const month = useAppSelector((state) => state.calendar.month)
    const year = useAppSelector((state) => state.calendar.year)

    return (
        <div className="sticky grid grid-cols-7 bg-accents-6 py-3.5 rounded-lg border-2 border-[#42434b]">
            {getDaysOfWeek(year, month, date).map((weekDate, index) => (
                <div
                    className={cn('flex flex-col items-center', {
                        'text-accents-1 ': dayjs().isSame(weekDate, 'date'),
                    })}
                    key={index}
                >
                    <span className="text-[#62636a] first-letter:text-base text-[0px] md:text-base text-center">
                        {' '}
                        {WEEK_DAYS[index]}{' '}
                    </span>
                    <span> {weekDate.date()} </span>
                </div>
            ))}
        </div>
    )
}

type TaskContainerId = 'todo' | 'progress' | 'done'

const TasksSpaceContainer = () => {
    const [activeId, setActiveId] = useState<string | null>(null)

    const dispatch = useAppDispatch()
    const [width, setWidth] = useState(0)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateWidth = debounce(() => {
            const scrollWidth = ref?.current?.scrollWidth || 0
            const offsetWidth = ref?.current?.offsetWidth || 0
            setWidth(scrollWidth - offsetWidth)
        }, 500)

        if (ref.current) {
            updateWidth()
            window.addEventListener('resize', updateWidth)
        }
        () => window.removeEventListener('resize', updateWidth)
    }, [ref, width])

    function handleDragStart(event: DragStartEvent) {
        const id = event.active.id as string
        setActiveId(id)
    }

    const markAsInProgressHandler = (id: string) => {
        dispatch(markTaskAsInProgress(id))
    }
    const markAsDoneHandler = (id: string) => {
        dispatch(markTaskAsDone(id))
    }
    const markAsToDoHandler = (id: string) => {
        dispatch(markTaskAsToDo(id))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const id = event.active.id as string
        const containerId = event?.over?.id as TaskContainerId | null

        switch (containerId) {
            case 'done':
                markAsDoneHandler(id)
                break
            case 'progress':
                markAsInProgressHandler(id)
                break
            case 'todo':
                markAsToDoHandler(id)
                break
        }

        setActiveId(null)
    }

    return (
        <div className="flex-1 flex flex-col w-[100%] overflow-clip px-4 ">
            <motion.div
                ref={ref}
                drag="x"
                dragConstraints={{ right: 0, left: -width }}
                className="flex flex-1 py-4 gap-x-8"
            >
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <TodoContainer activeId={activeId} />
                    <ProgressContainer activeId={activeId} />
                    <DoneContainer activeId={activeId} />
                </DndContext>
            </motion.div>
        </div>
    )
}

interface TasksContainerProps {
    title: string
    tasks: Task[]
    activeId: string | null
    id: TaskContainerId
}

const TodoContainer = ({ activeId }: Pick<TasksContainerProps, 'activeId'>) => {
    const todoList = useAppSelector((state) => state.calendar.toDoList)

    return (
        <TasksContainer
            id="todo"
            activeId={activeId}
            title="To Do"
            tasks={todoList}
        />
    )
}

const ProgressContainer = ({
    activeId,
}: Pick<TasksContainerProps, 'activeId'>) => {
    const inProgressList = useAppSelector(
        (state) => state.calendar.inProgressList
    )

    return (
        <TasksContainer
            id="progress"
            activeId={activeId}
            title="In Progress"
            tasks={inProgressList}
        />
    )
}

const DoneContainer = ({ activeId }: Pick<TasksContainerProps, 'activeId'>) => {
    const doneList = useAppSelector((state) => state.calendar.doneList)

    return (
        <TasksContainer
            id="done"
            activeId={activeId}
            title="Done"
            tasks={doneList}
        />
    )
}

const TasksContainer = ({
    id,
    title,
    tasks,
    activeId,
}: TasksContainerProps) => {
    const { setNodeRef, isOver, active } = useDroppable({ id })

    const sourceContainerId = active?.data?.current?.containerId as string

    return (
        <div className="w-[25em] shrink-0 flex flex-col gap-y-7 bg-accents-6 px-5 py-[1.125em] border border-[#42434b] rounded-lg ">
            <div className="flex justify-between">
                <span className="text-xl first-letter:uppercase font-bold">
                    {' '}
                    {title}{' '}
                </span>
                <span className="border-2 border-white rounded-full p-0.5 grid place-items-center">
                    {' '}
                    <PlusIcon />{' '}
                </span>
            </div>

            <ul
                ref={setNodeRef}
                className="flex-1 flex flex-col gap-y-8"
                // onPointerDownCapture={e => e.stopPropagation()}
            >
                {tasks.map((task) => (
                    <Draggable id={task.id} key={task.id} containerId={id}>
                        <Task task={task} />
                    </Draggable>
                ))}
                {sourceContainerId !== id && isOver && activeId && (
                    <ListPreview />
                )}
            </ul>
            <div className="w-full mt-auto">
                <Button className="w-full grid place-items-center">
                    {' '}
                    Add Task{' '}
                </Button>
            </div>
        </div>
    )
}

interface DraggableProps {
    children: React.ReactNode
    id: string
    containerId: string
}

const Draggable = ({ children, id, containerId }: DraggableProps) => {
    const { setNodeRef, listeners, attributes, isDragging, transform } =
        useDraggable({ id, data: { containerId } })
    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined

    return (
        <li
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn({ 'opacity-60 touch-none': isDragging })}
            style={style}
            onPointerDownCapture={(e) => {
                e.stopPropagation()
                if (listeners) {
                    listeners['onPointerDown'](e)
                }
            }}
        >
            {children}
        </li>
    )
}

interface TaskProps {
    task: Task
}

const Task = ({ task }: TaskProps) => {
    return (
        <div className="p-3.5 bg-bg border border-[#42434b] rounded-md">
            <p> {task.title} </p>
        </div>
    )
}

const ListPreview = () => {
    return (
        <div className="w-full h-12 p-3.5 bg-accents-1 bg-opacity-5 border-2 border-accents-1 rounded-md" />
    )
}

export default CalendarDay
