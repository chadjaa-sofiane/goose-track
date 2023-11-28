import { it, describe, expect } from 'bun:test'
import { removeFalsyFields } from '../removeFalsyFields'

describe('removeFalsyFields', () => {
    it('should remove null fields from an object', () => {
        const input = {
            name: 'John',
            age: null,
            city: 'New York',
            country: undefined,
        }

        const result = removeFalsyFields(input)

        expect(result).toEqual({
            name: 'John',
            city: 'New York',
        })
    })

    it('should not modify the original object', () => {
        const input = {
            name: 'Alice',
            age: 25,
            city: 'Paris',
        }

        const result = removeFalsyFields(input)

        expect(result).toEqual(input)
    })

    it('should handle an empty object', () => {
        const input = {}

        const result = removeFalsyFields(input)

        expect(result).toEqual({})
    })
})
