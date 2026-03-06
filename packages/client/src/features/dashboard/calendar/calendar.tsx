import { DashboardPageLayout } from '../dashboardLayout'
import { CalendarHeader } from './components/calendarHeader'
import { CalendarBody } from './components/calendarBody'
import { setDate, setDisplay, type Display } from '@/redux/calendarSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

const parseYearParam = (param: string): number | undefined => {
    const value = Number(param)
    return Number.isInteger(value) && value > 0 ? value : undefined
}

const parseMonthParam = (param: string): number | undefined => {
    const value = Number(param)
    return Number.isInteger(value) && value >= 0 && value <= 11
        ? value
        : undefined
}

const parseDateParam = (param: string): number | undefined => {
    const value = Number(param)
    return Number.isInteger(value) && value >= 1 && value <= 31
        ? value
        : undefined
}

const Calendar = () => {
    const display = useAppSelector((state) => state.calendar.display)
    const year = useAppSelector((state) => state.calendar.year)
    const month = useAppSelector((state) => state.calendar.month)
    const date = useAppSelector((state) => state.calendar.date)
    const dispatch = useAppDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const isInitialized = useRef(false)

    useEffect(() => {
        if (isInitialized.current) return

        const urlYear = parseYearParam(searchParams.get('year') || '')
        const urlMonth = parseMonthParam(searchParams.get('month') || '')
        const urlDate = parseDateParam(searchParams.get('date') || '')

        if (
            urlYear !== undefined &&
            urlMonth !== undefined &&
            urlDate !== undefined
        ) {
            dispatch(setDate({ year: urlYear, month: urlMonth, date: urlDate }))
        } else {
            const nextSearchParams = new URLSearchParams(searchParams)
            nextSearchParams.set('year', String(year))
            nextSearchParams.set('month', String(month))
            nextSearchParams.set('date', String(date))
            setSearchParams(nextSearchParams, { replace: true })
        }

        isInitialized.current = true
    }, [date, dispatch, month, searchParams, setSearchParams, year])

    useEffect(() => {
        if (!isInitialized.current) return

        const nextSearchParams = new URLSearchParams(searchParams)
        const nextYear = String(year)
        const nextMonth = String(month)
        const nextDate = String(date)

        if (
            searchParams.get('year') === nextYear &&
            searchParams.get('month') === nextMonth &&
            searchParams.get('date') === nextDate
        ) {
            return
        }

        nextSearchParams.set('year', nextYear)
        nextSearchParams.set('month', nextMonth)
        nextSearchParams.set('date', nextDate)
        setSearchParams(nextSearchParams, { replace: true })
    }, [date, month, searchParams, setSearchParams, year])

    const handleSetDisplay = (nextDisplay: Display) => {
        dispatch(setDisplay(nextDisplay))
    }

    if (!display) return null

    return (
        <DashboardPageLayout title="Calendar">
            <section className="flex-1 flex flex-col gap-y-8 ">
                <CalendarHeader setDisplay={handleSetDisplay} />
                <CalendarBody />
            </section>
        </DashboardPageLayout>
    )
}

export default Calendar
