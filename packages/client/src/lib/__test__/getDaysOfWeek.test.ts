import { describe, it, expect } from 'vitest'
import { getDaysOfWeek } from '../utils'

describe('getDaysOfWeek', () => {
    it('should return array of seven days each time', () => {
        const dates = [
            [2023, 0, 1],
            [2023, 0, 15],
            [2023, 0, 30],
            [2023, 11, 0],
            [2023, 11, 15],
            [2023, 11, 30],
        ]

        for (const dateArray of dates) {
            const [year, month, date] = dateArray

            const daysOfWeek = getDaysOfWeek(year, month, date)

            expect(daysOfWeek.length).toBe(7)
        }
    })

    it('it should return the previous year currectly', () => {
        const year = 2024
        const month = 0
        const date = 1

        const daysOfWeek = getDaysOfWeek(year, month, date)

        expect(daysOfWeek[0].year()).toEqual(2023)
    })
})
