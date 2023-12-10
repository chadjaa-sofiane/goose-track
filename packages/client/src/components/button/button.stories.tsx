import type { Meta, StoryObj } from '@storybook/react'
import ExitIcon from '@/assets/exit.svg?react'
import PlusIcon from '@/assets/plus.svg?react'
import { Button } from '.'

const meta = {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Exit: Story = {
    args: {
        children: 'exit',
        icons: {
            end: <ExitIcon className="stroke-white" />,
        },
    },
}

export const Add: Story = {
    args: {
        children: 'add',
        icons: {
            start: <PlusIcon className="stroke-white" />,
        },
    },
}
