import React, { useState } from 'react'
import { cn, getDaysOfMonth } from '@/lib/utils'
import { Dayjs } from 'dayjs'
import LeftChevron from '@/assets/chevron-left.svg?react'
import RightChevron from '@/assets/chevron-right.svg?react'

import dayjs from 'dayjs'

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const Calendar = () => {
    const [month, setMonth] = useState(() => dayjs().month())
    const [year, setYear] = useState(() => dayjs().year())
    const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null)

    const handleSelectDay = (selectDay: Dayjs) => {
        setSelectedDay(selectDay)
    }

    return (
        <div className="overflow-hidden w-[20.4375em] sm:w-[23.3125em] p-4 bg-accents-1 rounded-lg flex flex-col items-center select-none">
            <CalendarHeader
                month={month}
                year={year}
                setMonth={setMonth}
                setYear={setYear}
            />
            <div className="grid grid-cols-7 ">
                {WEEK_DAYS.map((day, index) => (
                    <CalendarCell
                        className="font-bold text-sm sm:text-lg"
                        key={index}
                    >
                        {day}
                    </CalendarCell>
                ))}
            </div>
            <div className="bg-white bg-opacity-20 w-[110%] sm:w-full h-[1px]" />
            <div className="grid grid-cols-7">
                {getDaysOfMonth(year, month).map((day, index) =>
                    day ? (
                        <DayCell
                            key={index}
                            day={day}
                            selectedDay={selectedDay}
                            handleSelectDay={handleSelectDay}
                        />
                    ) : (
                        <CalendarCell key={index}> </CalendarCell>
                    )
                )}
            </div>
        </div>
    )
}

interface CalendarHeaderProps {
    month: number
    year: number
    setMonth: React.Dispatch<React.SetStateAction<number>>
    setYear: React.Dispatch<React.SetStateAction<number>>
}

const CalendarHeader = ({
    month,
    year,
    setMonth,
    setYear,
}: CalendarHeaderProps) => {
    const changeMonth = (increment: number) => {
        const date = dayjs().month(month).year(year).add(increment, 'month')
        setMonth(date.month())
        setYear(date.year())
    }
    return (
        <div className="w-full flex justify-between items-center">
            <LeftChevron
                onClick={() => changeMonth(-1)}
                className="cursor-pointer"
            />
            <span className="font-bold text-xl sm:text-2xl">
                {dayjs().month(month).format('MMMM')} {year}
            </span>
            <RightChevron
                onClick={() => changeMonth(1)}
                className="cursor-pointer"
            />
        </div>
    )
}

interface CalendarCellProps {
    children: string | number
    onClick?: React.MouseEventHandler<HTMLDivElement>
    className?: string
}

const CalendarCell = ({ children, onClick, className }: CalendarCellProps) => {
    return (
        <div
            onClick={onClick}
            className={cn('w-12 h-12 grid place-items-center', className)}
        >
            {children}
        </div>
    )
}

interface DayCellProps {
    day: Dayjs
    selectedDay: Dayjs | null
    handleSelectDay: (selectDay: Dayjs) => void
}

const DayCell = ({ day, selectedDay, handleSelectDay }: DayCellProps) => {
    const isToday = dayjs().isSame(day, 'day')
    const isSelected = day.isSame(selectedDay, 'day')

    return (
        <CalendarCell
            onClick={() => handleSelectDay(day)}
            className={cn('rounded-full text-sm sm:text-lg ', {
                'bg-white bg-opacity-20': isToday && !isSelected,
                'bg-white text-accents-1': isSelected,
                'hover:bg-white hover:bg-opacity-10 cursor-pointer':
                    !isToday && !isSelected,
            })}
        >
            {day.date()}
        </CalendarCell>
    )
}
export default Calendar
