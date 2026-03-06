import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

type UseUrlParamStateOptions<T> = {
    key: string
    defaultValue: T
    parse?: (value: string) => T | undefined
    serialize?: (value: T) => string
    replace?: boolean
}

type SetUrlParamState<T> = (value: T | undefined) => void

const identityParse = <T>(value: string) => value as T
const defaultSerialize = <T>(value: T) => String(value)

export const useUrlParamState = <T>({
    key,
    defaultValue,
    parse = identityParse,
    serialize = defaultSerialize,
    replace = true,
}: UseUrlParamStateOptions<T>): [T, SetUrlParamState<T>] => {
    const [searchParams, setSearchParams] = useSearchParams()

    const value = useMemo(() => {
        const paramValue = searchParams.get(key)
        if (paramValue === null) return defaultValue
        const parsedValue = parse(paramValue)
        return parsedValue === undefined ? defaultValue : parsedValue
    }, [defaultValue, key, parse, searchParams])

    const setValue = useCallback<SetUrlParamState<T>>(
        (nextValue) => {
            const nextSearchParams = new URLSearchParams(searchParams)

            if (nextValue === undefined) {
                nextSearchParams.delete(key)
            } else {
                nextSearchParams.set(key, serialize(nextValue))
            }

            setSearchParams(nextSearchParams, { replace })
        },
        [key, replace, searchParams, serialize, setSearchParams]
    )

    return [value, setValue]
}
