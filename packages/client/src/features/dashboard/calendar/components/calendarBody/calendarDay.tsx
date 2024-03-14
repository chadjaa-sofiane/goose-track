import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { cn, debounce, getDaysOfWeek } from '@/lib/utils'
import {
    WEEK_DAYS,
    addContainer,
    createDayTask,
    markTask,
    reOrderContainers,
    setDate,
    updateContainerTitle,
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
    closestCenter,
} from '@dnd-kit/core'
import { Task } from '@/redux/calendarSlice'
import { AddTask, UseEditTask } from './TaskForm'
import CircleArrowIcon from '@/features/dashboard/assets/circle-arrow.svg?react'
import DraggableIcon from '@/features/dashboard/assets/draggable.svg?react'
import TrashIcon from '@/features/dashboard/assets/trash.svg?react'
import PencilIcon from '@/features/dashboard/assets/pencil.svg?react'
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { UseDeleteTask } from './deleteTask'
import {
    SortableContext,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const DRAG_TYPES = {
    TASK: 'drag_task',
    CONTAINER: 'sort_container',
} as const

const CalendarDay = () => {
    return (
        <div className="w-full flex-1 flex flex-col gap-y-4 overflow-clip">
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

    const ref = useRef<HTMLDivElement>(null)

    const tasks = useAppSelector((state) => state.calendar.tasks[tasksDate])

    useEffect(() => {
        if (!tasks) {
            dispatch(createDayTask({ date: tasksDate }))
        }
    }, [tasks, tasksDate, dispatch])

    function handleDragStart(event: DragStartEvent) {
        const id = event.active.id as string
        setActiveId(id)
    }

    const dragTaskHandler = (event: DragEndEvent) => {
        const { active, over } = event
        const id = active.id as string
        const targetContainer = over?.id as string
        const sourceContainer = active?.data?.current?.container as string
        if (targetContainer && sourceContainer !== targetContainer) {
            dispatch(
                markTask({
                    container: targetContainer,
                    date: tasksDate,
                    id,
                })
            )
        }
    }

    const swapContainerHandler = (event: DragEndEvent) => {
        const { active, over } = event
        const oldIndex = tasks?.containers.findIndex(
            (container) => container.id === active.id
        )
        const newIndex = tasks?.containers.findIndex(
            (container) => container.id === over?.id
        )
        dispatch(reOrderContainers({ date: tasksDate, oldIndex, newIndex }))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const dragType = event?.active?.data?.current
            ?.type as (typeof DRAG_TYPES)[keyof typeof DRAG_TYPES]

        switch (dragType) {
            case DRAG_TYPES.TASK:
                dragTaskHandler(event)
                break
            case DRAG_TYPES.CONTAINER:
                swapContainerHandler(event)
                break
        }

        setActiveId(null)
    }

    return (
        <motion.div
            ref={ref}
            className="w-fit max-w-full h-full flex-1 flex flex-col  px-4"
        >
            <motion.div
                drag="x"
                // dragConstraints={{ right: 0, left: 0 }}
                dragConstraints={ref}
                // onMeasureDragConstraints={ref}
                className="flex flex-1 py-4 gap-x-8 w-fit"
            >
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCenter}
                >
                    <SortableContext strategy={horizontalListSortingStrategy}>
                        items={tasks?.containers || []}
                        {tasks?.containers.map(({ id, title, tasks }) => (
                            <TasksContainer
                                key={id}
                                id={id}
                                activeId={activeId}
                                title={title}
                                tasks={tasks}
                                tasksDate={tasksDate}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </motion.div>
        </motion.div>
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
    const {
        setNodeRef: sortableRef,
        listeners,
        attributes,
        transform,
        transition,
        active: sortableActive,
    } = useSortable({
        id,
        data: {
            type: DRAG_TYPES.CONTAINER,
        },
    })

    const isSorted = sortableActive?.id === id

    const { setNodeRef, isOver, active } = useDroppable({ id })
    const dispatch = useAppDispatch()

    const sourceContainerId = active?.data?.current?.container as string
    const shouldMarkTask = sourceContainerId !== id && isOver && activeId
    const { EditTask, openEditTask } = UseEditTask({
        container: id,
        date: tasksDate,
        title,
    })
    const { DeleteTask, openDeleteTask } = UseDeleteTask({
        container: id,
        date: tasksDate,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleNewContainer = () => {
        dispatch(
            addContainer({
                date: tasksDate,
                title: '',
                prevContainerId: id,
            })
        )
    }
    return (
        <div
            ref={sortableRef}
            style={style}
            {...attributes}
            className={cn(
                'w-[25em] shrink-0 flex flex-col gap-y-7 bg-accents-6 px-5 py-[1.125em] border border-[#42434b] rounded-lg',
                {
                    'border border-accents-1': shouldMarkTask,
                    'bg-accents-1 bg-opacity-25 scale-[1.01] duration-200 transition-transform':
                        isSorted,
                }
            )}
        >
            <div className="flex justify-between">
                <span
                    {...listeners}
                    onPointerDownCapture={(e) => {
                        e.stopPropagation()

                        if (listeners) {
                            listeners['onPointerDown'](e)
                            listeners['onKeyDown'](e)
                        }
                    }}
                    className="grid place-items-center cursor-pointer hover:scale-105"
                >
                    <DraggableIcon className="fill-text" />
                </span>
                <ContainerTitle
                    title={title}
                    date={tasksDate}
                    containerId={id}
                />
                <span className="border-2 border-white rounded-full p-0.5 grid place-items-center cursor-pointer">
                    <PlusIcon onClick={handleNewContainer} />
                </span>
            </div>

            {activeId &&
                createPortal(
                    <DragOverlay className="fixed">
                        <PortableElement ref={portableRef} />
                    </DragOverlay>,
                    document.body
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
                {shouldMarkTask && <ListPreview />}
            </ul>
            <EditTask />
            <DeleteTask />
            <div className="w-full mt-auto">
                <AddTask container={id} date={tasksDate} title={title} />
            </div>
        </div>
    )
}

interface ContainerTitleProps {
    title: string
    date: string
    containerId: string
}

const DEBOUNCE_MILI_SECONDS = 1000

const ContainerTitle = ({
    title: defaultTitle,
    date,
    containerId,
}: ContainerTitleProps) => {
    const [title, setTitle] = useState(defaultTitle)
    const titleRef = useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTitle(e.target.value)

    const updateTitle = useMemo(
        () =>
            debounce((title: string) => {
                dispatch(updateContainerTitle({ date, containerId, title }))
            }, DEBOUNCE_MILI_SECONDS),
        [containerId, date, dispatch]
    )

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus()
        }
    }, [])

    const handleNoTitle = () => {
        if (title.trim() === '') {
            setTitle('no Title !')
        }
    }

    useEffect(() => {
        updateTitle(title)
    }, [updateTitle, title])

    return (
        <span className="relative text-xl first-letter:uppercase font-bold">
            <input
                ref={titleRef}
                className="bg-transparent w-full h-full outline-none placeholder:text-accents-1"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleNoTitle}
            />
        </span>
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
            type: DRAG_TYPES.TASK,
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
            className="flex flex-col gap-y-8 p-3.5 text-text bg-bg border border-[#42434b] rounded-md"
        >
            <div
                {...listeners}
                {...attributes}
                onPointerDownCapture={(e) => {
                    e.stopPropagation()

                    if (listeners) {
                        listeners['onPointerDown'](e)
                        listeners['onKeyDown'](e)
                    }
                }}
                className="flex items-center gap-3"
            >
                <span>
                    <DraggableIcon className="fill-white" />
                </span>
                <p className="align-top"> {task.title} </p>
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
