import React, { useState } from 'react'
import { cn, getDaysOfMonth } from '@/lib/utils'
import { Dayjs } from 'dayjs'
import LeftChevron from '@/assets/chevron-left.svg?react'
import RightChevron from '@/assets/chevron-right.svg?react'

import dayjs from 'dayjs'

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const Callender = () => {
    const [month, setMonth] = useState(() => dayjs().month())
    const [year, setYear] = useState(() => dayjs().year())
    const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null)

    const handleSelectDay = (selectDay: Dayjs) => {
        setSelectedDay(selectDay)
    }

    return (
        <div className="w-[23.3125em] p-4 bg-accents-1 rounded-lg">
            <CallenderHeader
                month={month}
                year={year}
                setMonth={setMonth}
                setYear={setYear}
            />
            <div className="grid grid-cols-7 ">
                {WEEK_DAYS.map((day, index) => (
                    <CallenderCell className="font-bold" key={index}>
                        {day}
                    </CallenderCell>
                ))}
                {getDaysOfMonth(month, year).map((day, index) =>
                    day ? (
                        <DayCell
                            key={index}
                            day={day}
                            selectedDay={selectedDay}
                            handleSelectDay={handleSelectDay}
                        />
                    ) : (
                        <CallenderCell key={index}> </CallenderCell>
                    )
                )}
            </div>
        </div>
    )
}

interface CallenderHeaderProps {
    month: number
    year: number
    setMonth: React.Dispatch<React.SetStateAction<number>>
    setYear: React.Dispatch<React.SetStateAction<number>>
}

const CallenderHeader = ({
    month,
    year,
    setMonth,
    setYear,
}: CallenderHeaderProps) => {
    console.log(month, year)

    const changeMonth = (increment: number) => {
        const date = dayjs().month(month).year(year).add(increment, 'month')
        setMonth(date.month())
        setYear(date.year())
    }
    return (
        <div className="flex justify-between items-center">
            <LeftChevron
                onClick={() => changeMonth(-1)}
                className="cursor-pointer"
            />
            <span className="font-bold text-2xl">
                {' '}
                {dayjs().month(month).format('MMMM')} {year}{' '}
            </span>
            <RightChevron
                onClick={() => changeMonth(1)}
                className="cursor-pointer"
            />
        </div>
    )
}

interface CallenderCellProps {
    children: string | number
    onClick?: React.MouseEventHandler<HTMLDivElement>
    className?: string
}

const CallenderCell = ({
    children,
    onClick,
    className,
}: CallenderCellProps) => {
    return (
        <div
            onClick={onClick}
            className={cn('w-12 h-12 grid place-items-center', className)}
        >
            {' '}
            {children}{' '}
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
        <CallenderCell
            onClick={() => handleSelectDay(day)}
            className={cn('rounded-full', {
                'bg-white bg-opacity-20': isToday && !isSelected,
                'bg-white text-accents-1': isSelected,
                'hover:bg-white hover:bg-opacity-10 cursor-pointer':
                    !isToday && !isSelected,
            })}
        >
            {day.date()}
        </CallenderCell>
    )
}
export default Callender
