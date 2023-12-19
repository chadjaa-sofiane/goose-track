import { useAppSelector } from '@/hooks/reduxHooks'
import { cn, getDaysOfMonth } from '@/lib/utils'
import { WEEK_DAYS } from '@/redux/calendarSlice'
import dayjs, { type Dayjs } from 'dayjs'

const CalendarMonth = () => {
    const month = useAppSelector((state) => state.calendar.month)
    const year = useAppSelector((state) => state.calendar.year)

    return (
        <div className="flex flex-col gap-y-4 flex-1">
            <WeekDaysField />
            <div className="grid grid-cols-7 flex-1 bg-accents-6 border border-[#42434b] rounded-lg overflow-hidden border-collapse">
                {getDaysOfMonth(year, month).map((date, index) => (
                    <DayCell
                        key={index}
                        date={date}
                        year={year}
                        month={month}
                        // selectedDay={selectedDay}
                    />
                ))}
            </div>
        </div>
    )
}

const WeekDaysField = () => {
    return (
        <div className="grid grid-cols-7 justify-center bg-accents-6 py-3.5 rounded-lg border-2 border-[#42434b]">
            {WEEK_DAYS.map((day, index) => (
                <div
                    className={cn(
                        'text-center font-semibold text-[0px] first-letter:text-base md:text-base',
                        { 'text-accents-1': index === 5 || index === 6 }
                    )}
                    key={index}
                >
                    {day}
                </div>
            ))}
        </div>
    )
}

interface CallenderCellProps {
    date?: string | number
    onClick?: React.MouseEventHandler<HTMLDivElement>
    className?: string
    children: React.ReactNode
    isToday?: boolean
    sameMonth: boolean
}

const CallenderCell = ({
    date,
    onClick,
    className,
    children,
    isToday = false,
    sameMonth,
}: CallenderCellProps) => {
    return (
        <div
            className={cn(
                'relative p-3.5 border-collapse border border-[#42434b]',
                className
            )}
            onClick={onClick}
        >
            {date && (
                <>
                    <span
                        className={cn('absolute right-3.5 top-3.5', {
                            'bg-accents-1 px-2 py-1 rounded-lg': isToday,
                            'text-gray-600': !sameMonth,
                        })}
                    >
                        {' '}
                        {date}{' '}
                    </span>
                    {children}
                </>
            )}
        </div>
    )
}

interface DayCellProps {
    date: Dayjs
    selectedDay?: Dayjs | null
    year: number
    month: number
}

const DayCell = ({ date, year, month }: DayCellProps) => {
    const isToday = dayjs().isSame(date, 'date')
    const sameMonth = date.isSame(dayjs().year(year).month(month), 'month')

    return (
        <CallenderCell
            date={date.date()}
            isToday={isToday}
            sameMonth={sameMonth}
        >
            <></>
        </CallenderCell>
    )
}

export default CalendarMonth
