import { cn } from '@/lib/utils'
import React, { ComponentPropsWithoutRef } from 'react'
import DoneIcon from '@/assets/Done.svg?react'
import WarningIcon from '@/assets/warning.svg?react'

type Status = 'error' | 'done'

interface InputFieldProps extends ComponentPropsWithoutRef<'input'> {
    type?: 'string' | 'email' | 'password'
    label: string
    name: string
    value: string
    placeHolder?: string
    message?: string | null
    status?: Status
}

const icon: Record<Status, React.ReactNode> = {
    done: <DoneIcon />,
    error: <WarningIcon />,
}

const InputField = ({
    type = 'string',
    label,
    name,
    placeHolder = '',
    value,
    message,
    status,
    ...rest
}: InputFieldProps) => {
    const error = status == 'error'
    const done = status == 'done'
    return (
        <div className="flex flex-col gap-y-2">
            <label
                className={cn('text-text text-opacity-50 text-sm', {
                    'text-error': !!error,
                    'text-done': done,
                })}
            >
                {' '}
                {label}{' '}
            </label>
            <div
                className={cn(
                    'bg-transparent outline-none border border-text border-opacity-50 py-3.5 px-[1.125em] rounded-md font-medium flex items-center',
                    {
                        'border-error': error,
                        'border-done': done,
                    }
                )}
            >
                <input
                    {...rest}
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeHolder}
                    className="bg-transparent outline-none"
                />
                <div>{status && icon[status]}</div>
            </div>
            {!!message && (
                <span
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
}

export default InputField