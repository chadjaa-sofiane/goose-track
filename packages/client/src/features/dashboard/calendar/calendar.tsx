import { DashboardPageLayout } from '../dashboardLayout'
import { CalendarHeader } from './components/calendarHeader'
import { CalendarBody } from './components/calendarBody'
import { useSearchParams } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { setDisplay, type Display, DISPLAY } from '@/redux/calendarSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'

const Calendar = () => {
    const display = useAppSelector((state) => state.calendar.display)
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useAppDispatch()
    const displayParams = (searchParams.get('display') as Display) || display

    const handleSetDisplay = useCallback(
        (display: Display) => {
            dispatch(setDisplay(display))
            setSearchParams({ display })
        },
        [dispatch, setSearchParams]
    )

    useEffect(() => {
        const updatedDisplay = !DISPLAY.includes(displayParams)
            ? display
            : displayParams
        handleSetDisplay(updatedDisplay)
    }, [display, displayParams, setSearchParams, dispatch, handleSetDisplay])

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
