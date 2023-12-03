import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef, forwardRef, useId } from 'react'
import DoneIcon from '@/assets/Done.svg?react'
import WarningIcon from '@/assets/warning.svg?react'

type Status = 'error' | 'done' | 'normal'

interface InputFieldProps extends ComponentPropsWithoutRef<'input'> {
    type?: 'string' | 'email' | 'password' | 'date'
    label: string
    name: string
    value?: string
    placeHolder?: string
    message?: string
    status?: Status
}

const icon: Record<Status, React.ReactNode> = {
    done: <DoneIcon />,
    error: <WarningIcon />,
    normal: <></>
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
    type = 'string',
    label,
    name,
    placeHolder = '',
    value,
    message,
    status = "normal",
    className,
    ...rest
}, ref) => {
    const error = status == 'error'
    const done = status == 'done'
    const id = useId()


    // Generate a unique ID for the error message
    const errorMessageId = useId();

    // Update aria-describedby dynamically based on the presence of an error message
    const ariaDescribedBy = error ? errorMessageId : undefined;

    return (
        <div className={cn("flex flex-col gap-y-2", className)}>
            <label
                className={cn('dark:text-[#62636a] text-opacity-50 text-sm first-letter:uppercase', {
                    'text-error': !!error,
                    'text-done': done,
                })}
                htmlFor={id}
            >
                {' '}
                {label}{' '}
            </label>
            <div
                className={cn(
                    'w-full bg-transparent outline-none border border-text border-opacity-50 py-3.5 px-[1.125em] rounded-md font-medium flex items-center',
                    {
                        'border-error': error,
                        'border-done': done,
                    }
                )}
            >
                <input
                    ref={ref}
                    id={id}
                    {...rest}
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeHolder}
                    className="w-full bg-transparent outline-none"
                    aria-describedby={ariaDescribedBy}
                />
                <div>{status && icon[status]}</div>
            </div>
            {!!message && (
                <span
                    role='alert'
                    id={errorMessageId}
                    aria-live="assertive"
                    aria-atomic="true"
                    data-testid={`error-message-${name}`}
                    className={cn('text-xs px-[1.125em]', {
                        'text-error': error,
                        'text-done': done,
                    })}
                >
                    {' '}
                    {message}{' '}
                </span>
            )}
        </div>
    )
})

export default InputField
