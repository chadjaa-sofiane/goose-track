import { useId } from 'react'

interface RadioSelectorProps {
    options: string[]
    selected: string
    onChange: (selected: string) => void
}

const RadioSelector = ({ options, selected, onChange }: RadioSelectorProps) => {
    const id = useId()
    return (
        <div className="flex overflow-hidden rounded-md">
            {options.map((option) => (
                <Option
                    key={option}
                    name={id}
                    value={option}
                    selected={selected}
                    onChange={onChange}
                />
            ))}
        </div>
    )
}

interface OptionProps {
    name: string
    value: string
    selected: RadioSelectorProps['selected']
    onChange: RadioSelectorProps['onChange']
}

const Option = ({ name, value, selected, onChange }: OptionProps) => {
    const checked = value === selected

    const handleChange = () => {
        if (!checked) {
            onChange(value)
        }
    }

    return (
        <div>
            <input
                id={value}
                name={name}
                value={value}
                type="radio"
                checked={checked}
                onChange={handleChange}
                className="peer/input"
                hidden
            />
            <label
                htmlFor={value}
                className={`
                w-20 block bg-accents-5 text-accents-1 peer-checked/input:bg-accents-4 py-2 first-letter:uppercase cursor-pointer text-center font-medium
                dark:bg-accents-6 dark:text-accents-1 dark:peer-checked/input:bg-accents-1 dark:peer-checked/input:text-text 
            `}
            >
                <div>{value}</div>
            </label>
        </div>
    )
}

export default RadioSelector
