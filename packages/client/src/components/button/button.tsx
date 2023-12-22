import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef, ReactElement } from 'react'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    children: string
    icons?: {
        start?: ReactElement
        end?: ReactElement
    }
}

const Button = ({
    children,
    icons,
    className,
    disabled = false,
    ...rest
}: ButtonProps) => {
    return (
        <button
            disabled={disabled}
            {...rest}
            className={cn(
                'px-6 py-4 bg-accents-1 text-white rounded-2xl font-bold  flex items-center gap-x-3 first-letter:uppercase',
                {
                    'cursor-not-allowed opacity-50': disabled,
                    'hover:bg-accents-2': !disabled,
                },
                className
            )}
        >
            {icons?.start && icons.start}
            <span className="first-letter:uppercase"> {children} </span>
            {icons?.end && icons.end}
        </button>
    )
}

export default Button
