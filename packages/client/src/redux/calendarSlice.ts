import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { doneList, inProgressList, toDoList } from './data/tasks'

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

export type Task = {
    id: string
    userId: string
    title: string
    start: string
    end: string
}

interface CalendarState {
    month: number
    year: number
    date: number
    currentMonth: number
    currentYear: number
    display: Display
    toDoList: Task[]
    inProgressList: Task[]
    doneList: Task[]
}

const initialState: CalendarState = {
    month: dayjs().month(),
    year: dayjs().year(),
    date: dayjs().date(),
    currentMonth: dayjs().month(),
    currentYear: dayjs().year(),
    display: 'month',
    toDoList,
    inProgressList,
    doneList,
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

const moveTaskToList = (
    taskId: string,
    sourceList: Task[],
    destList: Task[]
) => {
    const task = sourceList.find((task) => task.id === taskId)
    if (task) {
        destList.push(task)
        return sourceList.filter(({ id }) => id !== task.id)
    }
    return sourceList
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
        // Action to mark a todo as done

        markTaskAsDone: (state, action: PayloadAction<string>) => {
            const id = action.payload
            state.toDoList = moveTaskToList(id, state.toDoList, state.doneList)
            state.inProgressList = moveTaskToList(
                id,
                state.inProgressList,
                state.doneList
            )
        },

        // Action to mark a todo as In Progress
        markTaskAsInProgress: (state, action: PayloadAction<string>) => {
            const id = action.payload
            state.toDoList = moveTaskToList(
                id,
                state.toDoList,
                state.inProgressList
            )
            state.doneList = moveTaskToList(
                id,
                state.doneList,
                state.inProgressList
            )
        },

        // Action to mark a todo as To-Do
        markTaskAsToDo: (state, action: PayloadAction<string>) => {
            const id = action.payload
            state.inProgressList = moveTaskToList(
                id,
                state.inProgressList,
                state.toDoList
            )
            state.doneList = moveTaskToList(id, state.doneList, state.toDoList)
        },
    },
})

export const {
    nextMonth,
    prevMonth,
    setDisplay,
    nextWeek,
    prevWeek,
    markTaskAsDone,
    markTaskAsInProgress,
    markTaskAsToDo,
} = calendarSlice.actions
export default calendarSlice.reducer
