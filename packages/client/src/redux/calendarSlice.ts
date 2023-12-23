import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { doneList, inProgressList, toDoList } from './data/tasks'
import { addTaskFields } from '@/api/calendarApi'
import { TaskContainerId } from '@/features/dashboard/calendar/components/calendarBody/calendarDay'

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
    // tasks: Task[]
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
        addTask: {
            reducer: (
                state,
                action: PayloadAction<
                    addTaskFields & { field: TaskContainerId; id: string }
                >
            ) => {
                const field = action.payload.field
                const taskInput = action.payload
                const newTask: Task = {
                    userId: 'YourUserId',
                    ...taskInput,
                }
                switch (field) {
                    case 'todo': {
                        state.toDoList.push(newTask)
                        break
                    }
                    case 'progress': {
                        state.inProgressList.push(newTask)
                        break
                    }
                    case 'done': {
                        state.doneList.push(newTask)
                        break
                    }
                }
            },
            prepare: (inputs: addTaskFields & { field: TaskContainerId }) => {
                const id = generateTemporaryId()
                return { payload: { ...inputs, id } }
            },
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
    markTaskAsDone,
    markTaskAsInProgress,
    markTaskAsToDo,
    addTask,
} = calendarSlice.actions
export default calendarSlice.reducer
