import { twMerge } from 'tailwind-merge'
import clsx, { ClassValue } from 'clsx'
import dayjs from 'dayjs'
import type { ZodIssue } from 'zod'

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

export const extractErrorsFromIssues = (issues: ZodIssue[] = []) => {
    return issues.reduce((acc, issue) => {
        acc[issue.path[1]] = issue.message
        return acc
    }, {} as Record<string, string>)
}

/*

{
  "error": {
    "index": 0,
    "code": 11000,
    "keyPattern": {
      "email": 1
    },
    "keyValue": {
      "email": "chadjaa@gmail.com"
    }
  },
  "data": null
}

*/
type MongooseError = {
    name: string
    message: string
    code: number
    keyPattern: Record<string, number>
    keyValue: Record<string, string>
    index: number
}

export const extractMongooseErrors = (error: MongooseError | null) => {
    if (!error) return {}
    if (error?.code === 11000) {
        const keys = Object.keys(error.keyPattern)
        return {
            [keys[0]]: `${keys[0]} already exists !`,
        }
    }
}
