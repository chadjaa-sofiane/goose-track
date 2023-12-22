import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from '.'

const meta = {
    title: 'UI/InputField',
    component: InputField,
} satisfies Meta<typeof InputField>

export default meta

type Story = StoryObj<typeof meta>

export const Text: Story = {
    args: {
        label: 'text input',
        type: 'text',
        name: 'text',
    },
}

export const Date: Story = {
    args: {
        label: 'date input',
        type: 'date',
        name: 'date',
    },
}

export const Passwor: Story = {
    args: {
        label: 'date input',
        type: 'password',
        name: 'password',
    },
}
export const Time: Story = {
    args: {
        label: 'date input',
        type: 'time',
        name: '',
        value: '09:55',
    },
}
