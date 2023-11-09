import { twMerge } from 'tailwind-merge'
import clsx, { ClassValue } from 'clsx'
import dayjs from 'dayjs'

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

export const getDaysOfMonth = (
    month = dayjs().month(),
    year = dayjs().year()
) => {
    const firstDateOfMonth = dayjs().year(year).month(month).startOf('month')
    const lastDateOfMonth = dayjs().year(year).month(month).endOf('month')

    const daysOfMonth = []
    for (let i = 1; i < firstDateOfMonth.day(); i++) {
        daysOfMonth.push(null)
    }
    for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
        daysOfMonth.push(firstDateOfMonth.date(i))
    }

    return daysOfMonth
}
