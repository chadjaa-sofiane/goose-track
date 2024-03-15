import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { Tasks, tasks } from './data/tasks'
import { TaskFormFields } from '@/api/calendarApi'
import { arrayMove } from '@dnd-kit/sortable'

export const DISPLAY = ['month', 'day'] as const
export type Display = (typeof DISPLAY)[number]
export const WEEK_DAYS = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
] as const

export const priorites = ['low', 'medium', 'high'] as const

export type Task = {
    id: string
    createdAt: string
    userId: string
    title: string
    start: string
    end: string
    // status?: number
    // date: string
    priority: (typeof priorites)[number]
}

interface CalendarState {
    month: number
    year: number
    date: number
    currentMonth: number
    currentYear: number
    display: Display
    tasks: Tasks
}

const initialState: CalendarState = {
    month: dayjs().month(),
    year: dayjs().year(),
    date: dayjs().date(),
    currentMonth: dayjs().month(),
    currentYear: dayjs().year(),
    display: 'month',
    tasks,
    // tasks: tasks
}

const changeMonth = (month: number, year: number, increment: number) => {
    const date = dayjs().month(month).year(year).add(increment, 'month')
    return {
        year: date.year(),
        month: date.month(),
    }
}

export type TaskFormReducerPayload = TaskFormFields & {
    container: string
    date: string
}

export type CreateContainerPayload = {
    date: string
    title: string
    prevContainerId: string
}

const changeDate = (
    month: number,
    year: number,
    date: number,
    increment: number
) => {
    const newDate = dayjs()
        .month(month)
        .year(year)
        .date(date)
        .add(increment, 'day')
    return {
        year: newDate.year(),
        month: newDate.month(),
        date: newDate.date(),
    }
}

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        nextMonth: (state) => {
            const { month, year } = changeMonth(state.month, state.year, 1)
            state.month = month
            state.year = year
        },
        prevMonth: (state) => {
            const { month, year } = changeMonth(state.month, state.year, -1)

            if (state.currentYear >= year || state.currentMonth >= month) {
                state.month = month
                state.year = year
            }
        },
        setDisplay: (state, action: PayloadAction<Display>) => {
            if (!action.payload || !DISPLAY.includes(action.payload)) return
            state.display = action.payload
        },
        nextWeek: (state) => {
            const { month, year, date } = changeDate(
                state.month,
                state.year,
                state.date,
                7
            )
            state.date = date
            state.month = month
            state.year = year
        },
        prevWeek: (state) => {
            const { month, year, date } = changeDate(
                state.month,
                state.year,
                state.date,
                -7
            )
            state.date = date
            state.month = month
            state.year = year
        },
        setDate: (
            state,
            action: PayloadAction<{ year: number; month: number; date: number }>
        ) => {
            state.year = action.payload.year
            state.month = action.payload.month
            state.date = action.payload.date
        },
        markTask: (
            state,
            action: PayloadAction<{
                date: string
                container: string
                id: string
            }>
        ) => {
            const { container: targetContainerId, date, id } = action.payload
            const containers = state.tasks[date].containers
            const targetContainer = containers.find(
                (c) => c.id === targetContainerId
            )
            if (!targetContainer) return
            for (const container of containers) {
                if (container.id !== targetContainerId) {
                    const task = container.tasks.find((task) => task.id === id)
                    if (task) {
                        targetContainer.tasks = [...targetContainer.tasks, task]
                        container.tasks = container.tasks.filter(
                            (t) => t.id !== task.id
                        )
                        break
                    }
                }
            }
        },
        createDayTask: {
            reducer: (
                state,
                action: PayloadAction<{
                    date: string
                    createdAt: string
                    id: string
                }>
            ) => {
                const { date, createdAt, id } = action.payload
                state.tasks = {
                    ...state.tasks,
                    [date]: {
                        containersOrder: ['todo'],
                        containers: [
                            {
                                id,
                                title: 'to do list',
                                createdAt,
                                tasks: [],
                            },
                        ],
                    },
                }
            },
            prepare: (inputs: { date: string }) => {
                const createdAt = generateTemporaryTime()
                const id = generateTemporaryId()
                return {
                    payload: {
                        ...inputs,
                        createdAt,
                        id,
                    },
                }
            },
        },
        addTask: {
            reducer: (
                state,
                action: PayloadAction<
                    TaskFormReducerPayload & { id: string; createdAt: string }
                >
            ) => {
                const {
                    container: containerId,
                    date,
                    ...taskInputs
                } = action.payload
                state.tasks[date].containers = state.tasks[date].containers.map(
                    (container) =>
                        container.id === containerId
                            ? {
                                  ...container,
                                  tasks: [
                                      ...container.tasks,
                                      {
                                          userId: 'something something',
                                          ...taskInputs,
                                      },
                                  ],
                              }
                            : container
                )
            },
            prepare: (inputs: TaskFormReducerPayload) => {
                const id = generateTemporaryId()
                const createdAt = generateTemporaryTime()
                return { payload: { ...inputs, id, createdAt } }
            },
        },
        deleteTask: (
            state,
            action: PayloadAction<{
                date: string
                container: string
                taskId: string
            }>
        ) => {
            const {
                date,
                container: targetContainerId,
                taskId,
            } = action.payload
            const container = state.tasks[date].containers.find(
                (c) => c.id === targetContainerId
            )
            if (container) {
                container.tasks = container?.tasks.filter(
                    (task) => task.id !== taskId
                )
            }
        },

        editTask: (
            state,
            action: PayloadAction<TaskFormReducerPayload & { taskId: string }>
        ) => {
            const {
                container: targetContainerId,
                date,
                taskId,
                ...updatedTask
            } = action.payload
            const container = state.tasks[date].containers.find(
                (c) => c.id === targetContainerId
            )
            if (!container) return
            const taskIndex = container?.tasks.findIndex(
                (task) => task.id === taskId
            )

            if (taskIndex !== -1) {
                container.tasks[taskIndex] = {
                    ...container.tasks[taskIndex],
                    ...updatedTask,
                }
            }
        },
        addContainer: {
            reducer: (
                state,
                action: PayloadAction<
                    CreateContainerPayload & {
                        containerId: string
                        createdAt: string
                    }
                >
            ) => {
                const { date, title, containerId, createdAt, prevContainerId } =
                    action.payload

                const containers = state.tasks[date].containers

                const prevContainerIndex = containers.findIndex(
                    (c) => c.id === prevContainerId
                )

                const newContainer = {
                    id: containerId,
                    title,
                    createdAt,
                    tasks: [],
                }

                if (prevContainerIndex !== -1) {
                    state.tasks[date].containers = [
                        ...containers.slice(0, prevContainerIndex + 1),
                        newContainer,
                        ...containers.slice(prevContainerIndex + 1),
                    ]
                }
            },
            prepare: (inputs: CreateContainerPayload) => {
                const containerId = generateTemporaryId()
                const createdAt = generateTemporaryTime()
                return { payload: { ...inputs, containerId, createdAt } }
            },
        },
        updateContainerTitle: (
            state,
            action: PayloadAction<{
                date: string
                containerId: string
                title: string
            }>
        ) => {
            const { date, containerId, title } = action.payload
            const targetContainer = state.tasks[date].containers.find(
                (c) => c.id === containerId
            )
            state.tasks[date].containers.map((c) =>
                c.id === targetContainer?.id
                    ? {
                          ...c,
                          title,
                      }
                    : c
            )
        },
        reOrderContainers: (
            state,
            action: PayloadAction<{
                date: string
                oldIndex: number
                newIndex: number
            }>
        ) => {
            const { date, oldIndex, newIndex } = action.payload
            state.tasks[date].containers = arrayMove(
                state.tasks[date].containers,
                newIndex,
                oldIndex
            )
        },
    },
})

function generateTemporaryId() {
    const timestamp = Math.floor(Date.now() / 1000)
    const randomPart = Math.random().toString(36).substring(2, 7)
    return `${timestamp}-${randomPart}`
}

function generateTemporaryTime() {
    const date = new Date()
    return date.toISOString()
}

export const {
    nextMonth,
    prevMonth,
    setDisplay,
    nextWeek,
    prevWeek,
    setDate,
    markTask,
    createDayTask,
    addTask,
    deleteTask,
    editTask,
    addContainer,
    updateContainerTitle,
    reOrderContainers,
} = calendarSlice.actions
export default calendarSlice.reducer
