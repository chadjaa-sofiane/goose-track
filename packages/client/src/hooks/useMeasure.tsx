import { debounce } from '@/lib/utils'
import { useEffect, useRef, useMemo } from 'react'

const UseResizeObserver = <T extends HTMLElement>(
    callback: () => void,
    { debounceTime = 0 }: { debounceTime?: number } = {}
) => {
    const ref = useRef<T>(null)

    const debouncedSetWidth = useMemo(
        () =>
            debounce(() => {
                callback()
            }, debounceTime),
        [debounceTime, callback]
    )

    useEffect(() => {
        if (ref.current) {
            const element = ref.current
            const resizableObserver = new ResizeObserver((entries) => {
                const [entry] = entries
                if (entry) {
                    console.log()

                    debouncedSetWidth()
                }
            })
            resizableObserver.observe(element)
            return () => {
                resizableObserver.unobserve(element)
            }
        }
    }, [ref, debouncedSetWidth])
    return {
        ref,
    }
}

export default UseResizeObserver
