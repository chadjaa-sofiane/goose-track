type Nullable<T> = T | null | undefined

export const removeFalsyFields = <T>(obj: Record<string, Nullable<T>>) => {
    return Object.keys(obj).reduce((acc, key) => {
        if (obj[key] !== null && obj[key] !== undefined) {
            acc[key] = obj[key]
        }
        return acc
    }, {} as Record<string, unknown>)
}
