import ChevronLeftIcon from '@/assets/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/chevron-right.svg?react'
import { RadioSelector } from '@/components/radioSelector'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import {
    Display,
    nextMonth,
    nextWeek,
    prevMonth,
    prevWeek,
} from '@/redux/calendarSlice'
import dayjs from 'dayjs'

interface CalendarHeaderProps {
    setDisplay: (display: Display) => void
}

const CalendarHeader = ({ setDisplay }: CalendarHeaderProps) => {
    const display = useAppSelector((state) => state.calendar.display)

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
                {display === 'month' ? <MonthHeader /> : <MonthDay />}
            </div>
            <div>
                <RadioSelector
                    selected={display}
                    onChange={(select) => setDisplay(select as Display)}
                    options={['month', 'day']}
                />
            </div>
        </div>
    )
}

const MonthHeader = () => {
    const dispatch = useAppDispatch()
    const month = useAppSelector((state) => state.calendar.month)
    const year = useAppSelector((state) => state.calendar.year)
    const currentMonth = useAppSelector((state) => state.calendar.currentMonth)
    const currentYear = useAppSelector((state) => state.calendar.currentYear)

    const handleNextMonth = () => {
        dispatch(nextMonth())
    }
    const handlePrevMonth = () => {
        dispatch(prevMonth())
    }

    const canGoPrevMonth =
        year > currentYear || (year === currentYear && month > currentMonth)

    return (
        <>
            <div className="bg-accents-1 font-bold px-3 py-2 rounded-lg flex gap-x-1">
                <span className="uppercase">
                    {dayjs().month(month).format('MMMM')}
                </span>
                <span>{year}</span>
            </div>
            <div className="flex bg-[#42434b] gap-x-0.5 rounded-lg overflow-hidden border-2 border-[#42434b]">
                <PrevMonthButton
                    onClick={handlePrevMonth}
                    disabled={!canGoPrevMonth}
                />
                <NextMonthButton onClick={handleNextMonth} />
            </div>
        </>
    )
}
const MonthDay = () => {
    const dispatch = useAppDispatch()
    const month = useAppSelector((state) => state.calendar.month)
    const year = useAppSelector((state) => state.calendar.year)
    const date = useAppSelector((state) => state.calendar.date)

    const handleNextMonth = () => {
        dispatch(nextWeek())
    }
    const handlePrevMonth = () => {
        dispatch(prevWeek())
    }

    return (
        <>
            <div className="bg-accents-1 font-bold px-3 py-2 rounded-lg flex gap-x-1">
                <span> {date} </span>
                <span className="uppercase">
                    {dayjs().month(month).format('MMMM')}
                </span>
                <span>{year}</span>
            </div>
            <div className="flex bg-[#42434b] gap-x-0.5 rounded-lg overflow-hidden border-2 border-[#42434b]">
                <PrevMonthButton onClick={handlePrevMonth} />
                <NextMonthButton onClick={handleNextMonth} />
            </div>
        </>
    )
}

interface NavigateMonthButtonProps {
    disabled?: boolean
    onClick?: () => void
}

type Icon = React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string | undefined }
>

const NavigateMonthButton =
    (Icon: Icon) =>
    ({ disabled = false, onClick }: NavigateMonthButtonProps) => {
        return (
            <button
                className={cn('p-2 bg-accents-6', {
                    'cursor-not-allowed': disabled,
                    'cursor-pointer  hover:bg-opacity-75 ': !disabled,
                })}
                disabled={disabled}
                onClick={onClick}
            >
                <Icon
                    className={cn('stroke-white', {
                        'stroke-[#42434b]': disabled,
                    })}
                />
            </button>
        )
    }

const PrevMonthButton = NavigateMonthButton(ChevronLeftIcon)
const NextMonthButton = NavigateMonthButton(ChevronRightIcon)

export default CalendarHeader
