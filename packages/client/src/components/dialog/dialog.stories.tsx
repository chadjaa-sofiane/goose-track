import type { Meta, StoryObj } from '@storybook/react'
import { Dialog, DialogContent } from './dialog'
import { Button } from '../button'

const meta = {
    title: 'UI/Dialog',
    component: Dialog,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-screen h-screen bg-black">
                {' '}
                <Story />{' '}
            </div>
        ),
    ],
    tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        open: false,
        children: (
            <DialogContent className="w-1/2 flex flex-col gap-y-8">
                <h1 className="text-3xl text-center"> header </h1>
                <p>
                    {' '}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dicta voluptate doloribus nisi repudiandae unde mollitia
                    cupiditate ut! Deleniti incidunt sapiente veritatis tempore
                    natus dolores in minima, perspiciatis doloribus, quas
                    asperiores?{' '}
                </p>
                <div className="w-full flex justify-center mt-auto">
                    <Button> click me </Button>
                </div>
            </DialogContent>
        ),
    },
}
