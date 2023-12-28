import { forwardRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { cn, debounce, getDaysOfWeek } from '@/lib/utils'
import {
    WEEK_DAYS,
    createDayTask,
    markTask,
    setDate,
} from '@/redux/calendarSlice'
import PlusIcon from '@/assets/plus.svg?react'
import { motion } from 'framer-motion'
import dayjs, { Dayjs } from 'dayjs'
import {
    DndContext,
    useDraggable,
    DragStartEvent,
    DragEndEvent,
    useDroppable,
    DragOverlay,
    DraggableAttributes,
} from '@dnd-kit/core'
import { Task } from '@/redux/calendarSlice'
import { AddTask, UseEditTask } from './TaskForm'
import CircleArrowIcon from '@/features/dashboard/assets/circle-arrow.svg?react'
import TrashIcon from '@/features/dashboard/assets/trash.svg?react'
import PencilIcon from '@/features/dashboard/assets/pencil.svg?react'
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { UseDeleteTask } from './deleteTask'

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

    const dispatch = useAppDispatch()

    const setDateHandler = (weekDate: Dayjs) => {
        const year = weekDate.year()
        const month = weekDate.month()
        const date = weekDate.date()
        dispatch(setDate({ year, month, date }))
    }

    return (
        <div className="sticky grid grid-cols-7 bg-accents-6  rounded-lg border-2 border-[#42434b]">
            {getDaysOfWeek(year, month, date).map((weekDate, index) => (
                <div
                    className={cn(
                        'flex flex-col items-center cursor-pointer rounded-lg py-3.5',
                        {
                            'text-accents-1 ': dayjs().isSame(weekDate, 'date'),
                            'bg-bg/50  border border-accents-1':
                                weekDate.isSame(
                                    dayjs().year(year).month(month).date(date),
                                    'date'
                                ),
                        }
                    )}
                    key={index}
                    onPointerDown={() => setDateHandler(weekDate)}
                >
                    <span className="text-[#62636a] first-letter:text-base text-[0px] md:text-base text-center">
                        {WEEK_DAYS[index]}
                    </span>
                    <span> {weekDate.date()} </span>
                </div>
            ))}
        </div>
    )
}

export type TaskContainerId = 'todo' | 'progress' | 'done'

const TasksSpaceContainer = () => {
    const [activeId, setActiveId] = useState<string | null>(null)
    const date = useAppSelector((state) => state.calendar.date)
    const month = useAppSelector((state) => state.calendar.month)
    const year = useAppSelector((state) => state.calendar.year)

    const tasksDate = `${year}-${month}-${date}`

    const dispatch = useAppDispatch()
    const [width, setWidth] = useState(0)
    const ref = useRef<HTMLDivElement>(null)

    const tasks = useAppSelector((state) => state.calendar.tasks[tasksDate])

    useEffect(() => {
        if (!tasks) {
            dispatch(createDayTask({ date: tasksDate }))
        }
    }, [tasks, tasksDate, dispatch])

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

    const handleDragEnd = (event: DragEndEvent) => {
        const id = event.active.id as string
        const targetContainer = event?.over?.id as string
        const sourceContainer = event?.active?.data?.current
            ?.container as string

        if (targetContainer && sourceContainer !== targetContainer) {
            dispatch(
                markTask({
                    container: targetContainer,
                    date: tasksDate,
                    id,
                })
            )
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
                    {tasks?.containers &&
                        Object.entries(tasks?.containers)?.map(
                            ([name, container]) => (
                                <TasksContainer
                                    key={name}
                                    id={name}
                                    activeId={activeId}
                                    title={container.title}
                                    tasks={container.tasks}
                                    tasksDate={tasksDate}
                                />
                            )
                        )}
                </DndContext>
            </motion.div>
        </div>
    )
}

interface TasksContainerProps {
    title: string
    tasks: Task[]
    activeId: string | null
    id: string
    tasksDate: string
}

const TasksContainer = ({
    id,
    title,
    tasks,
    activeId,
    tasksDate,
}: TasksContainerProps) => {
    const portableRef = useRef<HTMLDivElement>(null)
    const { setNodeRef, isOver, active } = useDroppable({ id })

    const sourceContainerId = active?.data?.current?.container as string

    const { EditTask, openEditTask } = UseEditTask({
        container: id,
        date: tasksDate,
        title,
    })
    const { DeleteTask, openDeleteTask } = UseDeleteTask({
        container: id,
        date: tasksDate,
    })
    return (
        <div className="w-[25em] shrink-0 flex flex-col gap-y-7 bg-accents-6 px-5 py-[1.125em] border border-[#42434b] rounded-lg ">
            <div className="flex justify-between">
                <span className="text-xl first-letter:uppercase font-bold">
                    {title}
                </span>
                <span className="border-2 border-white rounded-full p-0.5 grid place-items-center">
                    <PlusIcon />
                </span>
            </div>

            {activeId && (
                <DragOverlay>
                    <PortableElement ref={portableRef} />
                </DragOverlay>
            )}

            <ul ref={setNodeRef} className="flex-1 flex flex-col gap-y-8">
                {tasks.map((task) => (
                    <Draggable
                        key={task.id}
                        id={task.id}
                        activeId={activeId}
                        overlayElement={portableRef.current}
                        task={task}
                        container={id}
                        openEditTask={openEditTask}
                        openDeleteTask={openDeleteTask}
                    />
                ))}
                {sourceContainerId !== id && isOver && activeId && (
                    <ListPreview />
                )}
            </ul>
            <EditTask />
            <DeleteTask />
            <div className="w-full mt-auto">
                <AddTask container={id} date={tasksDate} title={title} />
            </div>
        </div>
    )
}

interface DraggableProps {
    id: string
    activeId?: string | null
    overlayElement?: HTMLDivElement | null
    container: string
    task: Task
    openEditTask: (task: Task) => void
    openDeleteTask: (taskId: string) => void
}
const Draggable = ({
    id,
    activeId,
    overlayElement,
    container,
    task,
    openEditTask,
    openDeleteTask,
}: DraggableProps) => {
    const { setNodeRef, isDragging, listeners, attributes } = useDraggable({
        id,
        data: {
            container,
        },
    })

    return (
        <li ref={setNodeRef} className={cn({ 'opacity-60': isDragging })}>
            {overlayElement &&
                activeId === id &&
                createPortal(<Task task={task} />, overlayElement)}
            <Task
                task={task}
                listeners={listeners}
                attributes={attributes}
                openEditTask={openEditTask}
                openDeleteTask={openDeleteTask}
            />
        </li>
    )
}

interface TaskProps {
    task: Task
    listeners?: SyntheticListenerMap | undefined
    attributes?: DraggableAttributes
    openEditTask?: (task: Task) => void
    openDeleteTask?: (taskId: string) => void
}

const Task = ({
    task,
    listeners,
    attributes,
    openEditTask,
    openDeleteTask,
}: TaskProps) => {
    return (
        <motion.div
            // onHoverStart={{  }}
            className="flex flex-col gap-y-8 p-3.5 bg-bg border border-[#42434b] rounded-md"
        >
            <div
                {...listeners}
                {...attributes}
                onPointerDownCapture={(e) => {
                    e.stopPropagation()
                    console.log(listeners)

                    if (listeners) {
                        listeners['onPointerDown'](e)
                        listeners['onKeyDown'](e)
                    }
                }}
            >
                <p> {task.title} </p>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-x-2">
                    <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                    <div
                        className={cn(
                            'px-3 py-1 text-white rounded-md first-letter:uppercase',
                            {
                                'bg-priorities-low': task.priority === 'low',
                                'bg-priorities-medium':
                                    task.priority === 'medium',
                                'bg-priorities-high': task.priority === 'high',
                            }
                        )}
                    >
                        {' '}
                        {task.priority}{' '}
                    </div>
                </div>
                <div className="flex gap-x-2.5 cursor-pointer">
                    <CircleArrowIcon className="hover:scale-125" />
                    <PencilIcon
                        onClick={() => openEditTask?.(task)}
                        className="hover:scale-125"
                    />
                    <TrashIcon
                        onClick={() => openDeleteTask?.(task.id)}
                        className="hover:scale-125"
                    />
                </div>
            </div>
        </motion.div>
    )
}

const ListPreview = () => {
    return (
        <div className="w-full h-28 p-3.5 bg-accents-1 bg-opacity-5 border-2 border-accents-1 rounded-md" />
    )
}

const PortableElement = forwardRef<HTMLDivElement>((_, ref) => {
    return <div ref={ref} className="w-[22em] h-4"></div>
})

export default CalendarDay
