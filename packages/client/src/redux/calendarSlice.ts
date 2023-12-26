import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { Tasks, tasks } from './data/tasks'
import { addTaskFields } from '@/api/calendarApi'

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
    userId: string
    title: string
    start: string
    end: string
    // status?: number
    date: string
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
            const { container: targetContainer, date, id } = action.payload
            const containers = state.tasks[date].containers
            let task: Task | undefined
            for (const containerKey in containers) {
                if (containerKey !== targetContainer) {
                    const container = containers[containerKey]
                    task = container.tasks.find((task) => task.id === id)
                    if (task) {
                        container.tasks = container.tasks.filter(
                            (task) => task.id !== id
                        )
                        break
                    }
                }
            }
            if (task) containers[targetContainer].tasks.push(task)
        },
        createDayTask: (state, action: PayloadAction<{ date: string }>) => {
            const { date } = action.payload
            state.tasks = {
                ...state.tasks,
                [date]: {
                    containers: {
                        todo: {
                            order: 0,
                            title: 'to do list',
                            tasks: [],
                        },
                    },
                },
            }
        },
        addTask: {
            reducer: (
                state,
                action: PayloadAction<
                    addTaskFields & {
                        container: string
                        id: string
                        date: string
                    }
                >
            ) => {
                const container = action.payload.container
                const taskInput = action.payload
                const date = action.payload.date
                state.tasks[date].containers[container].tasks.push({
                    ...taskInput,
                    userId: 'sometihng',
                })
            },
            prepare: (
                inputs: addTaskFields & { container: string; date: string }
            ) => {
                const id = generateTemporaryId()
                return { payload: { ...inputs, id } }
            },
        },
        deleteTask: (
            state,
            action: PayloadAction<{
                date: string
                container: string
                id: string
            }>
        ) => {
            const { date, container: targetContainer, id } = action.payload
            const container = state.tasks[date].containers[targetContainer]
            container.tasks = container.tasks.filter((task) => task.id !== id)
        },
    },
})

function generateTemporaryId() {
    const timestamp = Math.floor(Date.now() / 1000)
    const randomPart = Math.random().toString(36).substring(2, 7)
    return `${timestamp}-${randomPart}`
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
} = calendarSlice.actions
export default calendarSlice.reducer
