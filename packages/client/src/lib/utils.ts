import { twMerge } from 'tailwind-merge'
import clsx, { ClassValue } from 'clsx'
import dayjs from 'dayjs'
import { type ZodIssue } from 'zod'
import type { Path, UseFormSetError } from 'react-hook-form'

/**
 * Combines class names using Tailwind CSS's twMerge and clsx utility functions.
 * This function is designed to simplify the process of combining class names in React components.
 *
 * @param {...ClassValue} inputs - Class names or class name arrays to be combined.
 *
 * @returns {string} - Combined class names as a single string.
 */

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

/**
 * Generates an array representing the days of a specified month and year.
 * This function is useful for creating a calendar view with the days of a given month.
 *
 * @param {number} month - The month (0-indexed) for which to generate days.
 * @param {number} year - The year for which to generate days.
 *
 * @returns {Array<dayjs.Dayjs | null>} - Array of dayjs objects representing the days of the specified month.
 */

export const getDaysOfMonth = (
    year = dayjs().year(),
    month = dayjs().month()
) => {
    const firstDateOfMonth = dayjs().year(year).month(month).startOf('month')
    const lastDateOfMonth = dayjs().year(year).month(month).endOf('month')

    const daysOfMonth = []

    for (let i = 0; i < firstDateOfMonth.day(); i++) {
        daysOfMonth.push(firstDateOfMonth.day(i))
    }
    for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
        daysOfMonth.push(firstDateOfMonth.date(i))
    }

    for (
        let i = lastDateOfMonth.day();
        i < lastDateOfMonth.endOf('week').day();
        i++
    ) {
        daysOfMonth.push(lastDateOfMonth.day(i))
    }
    return daysOfMonth
}

export const getDaysOfWeek = (
    year = dayjs().month(),
    month = dayjs().month(),
    date = dayjs().date()
) => {
    const startOfTheWeek = dayjs()
        .year(year)
        .month(month)
        .date(date)
        .startOf('week')

    const daysOfWeek = []
    for (let i = startOfTheWeek.date(); i <= startOfTheWeek.date() + 6; i++) {
        daysOfWeek.push(startOfTheWeek.date(i))
    }

    return daysOfWeek
}

/**
Extracts errors from an array of Zod validation issues and returns them as a key-value pair.

@param {ZodIssue[]} issues - An array of Zod validation issues.
@return {Record<string, string>} - A key-value pair where keys represent the path of the error and values represent the corresponding error message.
*/

export const extractErrorsFromIssues = (issues: ZodIssue[] = []) => {
    return issues.reduce((acc, issue) => {
        acc[issue.path[1]] = issue.message
        return acc
    }, {} as Record<string, string>)
}

type MongooseError = {
    name: string
    message: string
    code: number
    keyPattern: Record<string, number>
    keyValue: Record<string, string>
    index: number
}

/**
 * Extracts meaningful error messages from Mongoose error objects.
 * This function is specifically designed to handle errors commonly encountered when interacting with MongoDB using Mongoose.
 * note: currently it is only handeling errors with error code of 11000 (unique element).
 *
 * @param {MongooseError | null} error - Mongoose error object received from a MongoDB operation.
 *
 * @returns {Record<string, string>} - Extracted error messages mapped by field names.
 */

export const extractMongooseErrors = (error: MongooseError | null) => {
    if (!error) return {}
    if (error?.code === 11000) {
        const keys = Object.keys(error.keyPattern)
        return {
            [keys[0]]: `${keys[0]} already exists !`,
        }
    }
}

/**
 * Maps server-side validation errors to form errors for React Hook Form.
 * This function is designed to be used in conjunction with useForm from react-hook-form.
 *
 * @param {Function} setError - React Hook Form's setError function.
 * @param {Object} errors - Server-side validation errors received from an API response.
 *
 * @returns {void}
 */

export const mapServerErrorsToForm = <
    T extends Record<string, string | undefined | null>
>(
    setError: UseFormSetError<Required<T>>,
    errors: T
): void => {
    if (!errors) return
    for (const [key, value] of Object.entries(errors)) {
        if (!value) return
        setError(key as unknown as Path<Required<T>>, {
            type: 'manual',
            message: value,
        })
    }
}

/**
 * Debounces a function by delaying its execution until a certain amount of time has passed without any further calls.
 *
 * @template F - The type of the debounced function.
 * @param {F} func - The function to be debounced.
 * @param {number} delay - The delay in milliseconds before the function is executed.
 * @returns {(...args: Parameters<F>) => void} - The debounced function.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <F extends (...args: any[]) => unknown>(
    func: F,
    delay: number
) => {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return (...args: Parameters<F>) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => func(...args), delay)
    }
}

/**
 * Parses a time string in the format "HH:MM" and returns the time as milliseconds since midnight.
 * @param timeString - A string representing a time in the format "HH:MM".
 * @returns The time represented by the timeString as milliseconds since midnight.
 */
export const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const timeAsDate = new Date()
    timeAsDate.setHours(hours, minutes, 0, 0) // Set hours, minutes, seconds, and milliseconds

    return timeAsDate.getTime()
}
