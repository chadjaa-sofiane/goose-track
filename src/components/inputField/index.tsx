import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef } from 'react'

interface InputFieldProps extends ComponentPropsWithoutRef<'input'> {
    type?: 'string' | 'email' | 'password'
    label: string
    name: string
    value: string
    placeHolder?: string
    message?: string | null
    status?: 'error' | 'correct' | 'normal'
}

const InputField = ({
    type = 'string',
    label,
    name,
    placeHolder = '',
    value,
    message,
    status = 'normal',
    ...rest
}: InputFieldProps) => {
    const error = status == 'error'
    const correct = status == 'correct'
    return (
        <div className="flex flex-col gap-y-2">
            <label
                className={cn('text-text text-opacity-50 text-sm', {
                    'text-error': !!error,
                    'text-correct': correct,
                })}
            >
                {' '}
                {label}{' '}
            </label>
            <input
                {...rest}
                type={type}
                name={name}
                value={value}
                placeholder={placeHolder}
                className={cn(
                    'bg-transparent outline-none border border-text border-opacity-50 py-3.5 px-[1.125em] rounded-md font-medium',
                    {
                        'border-error': error,
                        'border-correct': correct,
                    }
                )}
            />
            {!!message && (
                <span
                    className={cn('text-xs px-[1.125em]', {
                        'text-error': error,
                        'text-correct': correct,
                    })}
                >
                    {' '}
                    {message}{' '}
                </span>
            )}
        </div>
    )
}

export default InputField
