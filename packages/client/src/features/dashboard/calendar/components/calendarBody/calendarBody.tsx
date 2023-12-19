import CalendarDay from './calendarDay'
import CalendarMonth from './calendarMonth'
import { useAppSelector } from '@/hooks/reduxHooks'

const CalendarBody = () => {
    const display = useAppSelector((state) => state.calendar.display)

    return <>{display === 'month' ? <CalendarMonth /> : <CalendarDay />}</>
}

export default CalendarBody
