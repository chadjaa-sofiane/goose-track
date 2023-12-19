import { describe, it, expect } from 'vitest'
import { getDaysOfMonth } from '../utils'

describe('getDaysOfMonth', () => {
    it('should return an array of 35 elements for each month', () => {
        const year = 2023
        for (let month = 0; month <= 11; month++) {
            const daysOfMonth = getDaysOfMonth(year, month)
            expect(daysOfMonth.length).greaterThanOrEqual(35)
            expect(daysOfMonth.length).lessThanOrEqual(42)
        }
    })

    it('should handle February correctly', () => {
        const daysOfMonthLeap = getDaysOfMonth(2024, 1) // Leap year
        const daysOfMonthNonLeap = getDaysOfMonth(2023, 1) // Non-leap year

        expect(daysOfMonthLeap[20].endOf('month').date()).toBe(29)
        expect(daysOfMonthNonLeap[20].endOf('month').date()).toBe(28)
    })
})
