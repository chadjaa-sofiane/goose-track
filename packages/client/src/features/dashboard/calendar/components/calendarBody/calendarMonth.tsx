import { useAppSelector } from '@/hooks/reduxHooks'
import { cn, getDaysOfMonth, parseTime } from '@/lib/utils'
import {
    createEmptyContainer,
    deleteTask,
    markTask,
    restoreTask,
    setDate,
    setDisplay,
    Task,
    WEEK_DAYS,
} from '@/redux/calendarSlice'
import dayjs, { type Dayjs } from 'dayjs'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/dialog'
import { Button } from '@/components/button'
import { AddTask } from './TaskForm'
import {
    deleteTaskById,
    isPersistedTaskId,
    updateTaskById,
} from '@/api/calendarApi'
import { useToast } from '@/components/toast/toastProvider'

type TaskWithContainer = Task & { containerTitle: string; containerId: string }

const CalendarMonth = () => {
    const month = useAppSelector((state) => state.calendar.month)
    const year = useAppSelector((state) => state.calendar.year)
    const containers = useAppSelector((state) => state.calendar.containers)

    return (
        <div className="flex flex-col gap-y-4 flex-1">
            <WeekDaysField />
            <div className="grid grid-cols-7 flex-1 overflow-hidden rounded-lg border border-accents-4 bg-accents-5/40 border-collapse">
                {getDaysOfMonth(year, month).map((date, index) => (
                    <DayCell
                        key={index}
                        date={date}
                        year={year}
                        month={month}
                        containers={containers}
                    />
                ))}
            </div>
        </div>
    )
}

const WeekDaysField = () => {
    return (
        <div className="grid grid-cols-7 justify-center rounded-lg border border-accents-4 bg-accents-5/40 py-3.5">
            {WEEK_DAYS.map((day, index) => (
                <div
                    className={cn(
                        'text-center font-semibold text-[0px] first-letter:text-base md:text-base',
                        { 'text-accents-1': index === 5 || index === 6 }
                    )}
                    key={index}
                >
                    {day}
                </div>
            ))}
        </div>
    )
}

interface CallenderCellProps {
    date?: string | number
    onClick?: React.MouseEventHandler<HTMLDivElement>
    className?: string
    children: React.ReactNode
    isToday?: boolean
    sameMonth: boolean
}

const CallenderCell = ({
    date,
    onClick,
    className,
    children,
    isToday = false,
    sameMonth,
}: CallenderCellProps) => {
    return (
        <div
            className={cn(
                'relative border border-accents-4 p-3.5 border-collapse',
                className
            )}
            onClick={onClick}
        >
            {date && (
                <>
                    <span
                        className={cn('absolute right-3.5 top-3.5', {
                            'bg-accents-1 px-2 py-1 rounded-lg': isToday,
                            'text-text/45': !sameMonth,
                        })}
                    >
                        {' '}
                        {date}{' '}
                    </span>
                    {children}
                </>
            )}
        </div>
    )
}

interface DayCellProps {
    date: Dayjs
    selectedDay?: Dayjs | null
    year: number
    month: number
    containers: Record<
        string,
        Record<
            string,
            Record<string, { id: string; title: string; tasks: Task[] }[]>
        >
    >
}

const DayCell = ({ date, year, month, containers }: DayCellProps) => {
    const isToday = dayjs().isSame(date, 'date')
    const sameMonth = date.isSame(dayjs().year(year).month(month), 'month')
    const dispatch = useAppDispatch()
    const { pushToast } = useToast()
    const [open, setOpen] = useState(false)
    const [moveTaskId, setMoveTaskId] = useState<string | null>(null)
    const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState<
        string | null
    >(null)
    const dayContainers =
        containers[date.year()]?.[date.month()]?.[date.date()] || []
    const tasks = dayContainers
        .flatMap((container) =>
            container.tasks.map((task) => ({
                ...task,
                containerTitle: container.title,
                containerId: container.id,
            }))
        )
        .sort((a, b) => parseTime(a.start) - parseTime(b.start))

    const previewTasks = tasks.slice(0, 3)
    const hiddenTasksCount = tasks.length - previewTasks.length
    const datePayload = {
        year: date.year(),
        month: date.month(),
        date: date.date(),
    }

    const openDialog = () => {
        dispatch(setDate(datePayload))
        if (dayContainers.length === 0) {
            dispatch(createEmptyContainer({ date: datePayload }))
        }
        setMoveTaskId(null)
        setConfirmDeleteTaskId(null)
        setOpen(true)
    }

    const openDayView = () => {
        dispatch(setDate(datePayload))
        dispatch(setDisplay('day'))
        setMoveTaskId(null)
        setConfirmDeleteTaskId(null)
        setOpen(false)
    }

    return (
        <>
            <CallenderCell
                date={date.date()}
                isToday={isToday}
                sameMonth={sameMonth}
                onClick={openDialog}
                className={cn(
                    'min-h-[9.5rem] cursor-pointer transition-colors',
                    {
                        'opacity-70': !sameMonth,
                        'hover:bg-accents-3/15': sameMonth,
                    }
                )}
            >
                <div className="mt-8 flex flex-col gap-y-2">
                    {previewTasks.map((task) => (
                        <TaskTag key={task.id} task={task} />
                    ))}
                    {hiddenTasksCount > 0 && (
                        <span className="text-xs font-semibold text-text/65">
                            +{hiddenTasksCount} more
                        </span>
                    )}
                </div>
            </CallenderCell>
            <Dialog open={open} setOpen={setOpen}>
                <DialogContent className="w-[44rem] max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-xl border border-accents-4 bg-bg p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-accents-6">
                            Tasks for {date.format('DD MMMM YYYY')}
                        </h3>
                        <Button
                            className="px-4 py-2 text-sm"
                            onClick={openDayView}
                        >
                            Open day view
                        </Button>
                    </div>
                    <div className="mt-4">
                        {dayContainers[0] ? (
                            <AddTask
                                container={dayContainers[0].id}
                                date={datePayload}
                                title={dayContainers[0].title}
                                buttonClassName="w-auto px-4 py-2 text-xs"
                            />
                        ) : (
                            <span className="text-sm text-text/60">
                                Preparing task form...
                            </span>
                        )}
                    </div>
                    <div className="mt-5 flex flex-col gap-y-3">
                        {tasks.length === 0 && (
                            <div className="rounded-lg border border-accents-4 bg-accents-5/35 p-4">
                                <p className="text-text/70">
                                    No tasks yet for this day.
                                </p>
                            </div>
                        )}
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-lg border border-accents-4 bg-accents-5/25 p-4"
                            >
                                <div className="flex items-start justify-between gap-x-3">
                                    <div>
                                        <p className="text-sm font-semibold text-text/70">
                                            {task.containerTitle}
                                        </p>
                                        <p className="mt-1 font-semibold text-text">
                                            {task.title}
                                        </p>
                                        <p className="mt-1 text-sm text-text/65">
                                            {task.start} - {task.end}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            'rounded-full px-2.5 py-1 text-xs font-semibold text-white',
                                            {
                                                'bg-priorities-low':
                                                    task.priority === 'low',
                                                'bg-priorities-medium':
                                                    task.priority === 'medium',
                                                'bg-priorities-high':
                                                    task.priority === 'high',
                                            }
                                        )}
                                    >
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <div className="relative">
                                        <Button
                                            className="px-3 py-2 text-xs"
                                            onClick={() =>
                                                setMoveTaskId((prev) => {
                                                    setConfirmDeleteTaskId(null)
                                                    return prev === task.id
                                                        ? null
                                                        : task.id
                                                })
                                            }
                                        >
                                            Move to...
                                        </Button>
                                        {moveTaskId === task.id && (
                                            <div className="absolute left-0 top-full z-20 mt-2 min-w-[12rem] rounded-lg border border-accents-4 bg-bg p-2 shadow-lg">
                                                <p className="px-2 pb-2 text-xs font-semibold text-text/65">
                                                    Move to container
                                                </p>
                                                <div className="flex flex-col gap-1">
                                                    {dayContainers
                                                        .filter(
                                                            (container) =>
                                                                container.id !==
                                                                task.containerId
                                                        )
                                                        .map((container) => (
                                                            <button
                                                                key={
                                                                    container.id
                                                                }
                                                                className="rounded-md px-2 py-1 text-left text-sm text-text transition-colors hover:bg-accents-5/60"
                                                                onClick={() => {
                                                                    dispatch(
                                                                        markTask(
                                                                            {
                                                                                date: datePayload,
                                                                                container:
                                                                                    container.id,
                                                                                id: task.id,
                                                                            }
                                                                        )
                                                                    )
                                                                    if (
                                                                        isPersistedTaskId(
                                                                            task.id
                                                                        )
                                                                    ) {
                                                                        void (async () => {
                                                                            try {
                                                                                const result =
                                                                                    await updateTaskById(
                                                                                        task.id,
                                                                                        {
                                                                                            container:
                                                                                                container.title,
                                                                                        }
                                                                                    )
                                                                                if (
                                                                                    !result.success
                                                                                ) {
                                                                                    dispatch(
                                                                                        markTask(
                                                                                            {
                                                                                                date: datePayload,
                                                                                                container:
                                                                                                    task.containerId,
                                                                                                id: task.id,
                                                                                            }
                                                                                        )
                                                                                    )
                                                                                    pushToast(
                                                                                        'Move failed. Task moved back.',
                                                                                        'error'
                                                                                    )
                                                                                }
                                                                            } catch {
                                                                                dispatch(
                                                                                    markTask(
                                                                                        {
                                                                                            date: datePayload,
                                                                                            container:
                                                                                                task.containerId,
                                                                                            id: task.id,
                                                                                        }
                                                                                    )
                                                                                )
                                                                                pushToast(
                                                                                    'Move failed. Task moved back.',
                                                                                    'error'
                                                                                )
                                                                            }
                                                                        })()
                                                                    }
                                                                    setMoveTaskId(
                                                                        null
                                                                    )
                                                                }}
                                                            >
                                                                {
                                                                    container.title
                                                                }
                                                            </button>
                                                        ))}
                                                    {dayContainers.filter(
                                                        (container) =>
                                                            container.id !==
                                                            task.containerId
                                                    ).length === 0 && (
                                                        <span className="px-2 py-1 text-xs text-text/60">
                                                            No other containers
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Button
                                            className="border border-red-500/70 bg-red-500/15 px-3 py-2 text-xs text-red-200 hover:bg-red-500/30"
                                            onClick={() =>
                                                setConfirmDeleteTaskId(
                                                    (prev) => {
                                                        setMoveTaskId(null)
                                                        return prev === task.id
                                                            ? null
                                                            : task.id
                                                    }
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>
                                        {confirmDeleteTaskId === task.id && (
                                            <div className="absolute right-0 top-full z-20 mt-2 min-w-[13rem] rounded-lg border border-red-500/50 bg-bg p-2 shadow-lg">
                                                <p className="px-2 pb-2 text-xs font-semibold text-red-300">
                                                    Delete this task?
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="flex-1 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-500"
                                                        onClick={async () => {
                                                            dispatch(
                                                                deleteTask({
                                                                    date: datePayload,
                                                                    container:
                                                                        task.containerId,
                                                                    taskId: task.id,
                                                                })
                                                            )
                                                            if (
                                                                isPersistedTaskId(
                                                                    task.id
                                                                )
                                                            ) {
                                                                try {
                                                                    const result =
                                                                        await deleteTaskById(
                                                                            task.id
                                                                        )
                                                                    if (
                                                                        !result.success
                                                                    ) {
                                                                        dispatch(
                                                                            restoreTask(
                                                                                {
                                                                                    date: datePayload,
                                                                                    container:
                                                                                        task.containerId,
                                                                                    task,
                                                                                }
                                                                            )
                                                                        )
                                                                        pushToast(
                                                                            'Delete failed. Task restored.',
                                                                            'error'
                                                                        )
                                                                    }
                                                                } catch {
                                                                    dispatch(
                                                                        restoreTask(
                                                                            {
                                                                                date: datePayload,
                                                                                container:
                                                                                    task.containerId,
                                                                                task,
                                                                            }
                                                                        )
                                                                    )
                                                                    pushToast(
                                                                        'Delete failed. Task restored.',
                                                                        'error'
                                                                    )
                                                                }
                                                            }
                                                            setConfirmDeleteTaskId(
                                                                null
                                                            )
                                                        }}
                                                    >
                                                        Confirm delete
                                                    </button>
                                                    <button
                                                        className="flex-1 rounded-md border border-accents-4 px-2 py-1 text-xs text-text/80 transition-colors hover:bg-accents-5/60"
                                                        onClick={() =>
                                                            setConfirmDeleteTaskId(
                                                                null
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

const TaskTag = ({ task }: { task: TaskWithContainer }) => {
    return (
        <div className="rounded-md border border-accents-4/80 bg-bg/45 px-2 py-1">
            <div className="truncate text-[11px] font-semibold text-text/70">
                {task.containerTitle}
            </div>
            <div className="flex items-center gap-x-2">
                <span
                    className={cn('h-2 w-2 rounded-full', {
                        'bg-priorities-low': task.priority === 'low',
                        'bg-priorities-medium': task.priority === 'medium',
                        'bg-priorities-high': task.priority === 'high',
                    })}
                />
                <span className="text-[11px] text-text/65">{task.start}</span>
                <span className="truncate text-xs font-medium text-text">
                    {task.title}
                </span>
            </div>
        </div>
    )
}

export default CalendarMonth
