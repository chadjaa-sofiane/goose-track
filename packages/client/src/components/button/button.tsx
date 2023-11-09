import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef, ReactElement } from 'react'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    children: string
    icons?: {
        start?: ReactElement
        end?: ReactElement
    }
}

const Button = ({ children, icons, className, ...rest }: ButtonProps) => {
    return (
        <button
            {...rest}
            className={cn("px-6 py-4 bg-accents-1 text-white rounded-2xl font-bold hover:bg-accents-2 flex items-center gap-x-3", className)}
        >
            {icons?.start && icons.start}
            <span> {children} </span>
            {icons?.end && icons.end}
        </button>
    )
}

export default Button
