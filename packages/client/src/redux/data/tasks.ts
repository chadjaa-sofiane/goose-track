import dayjs from 'dayjs'
import { Task } from '../calendarSlice'

type Container = {
    id: string
    title: string
    createdAt: string
    tasks: Task[]
}

export type Tasks = Record<string, Record<string, Record<string, Container[]>>>

// I want to get the current year, month, date using dayjs

const year = dayjs().year()
const month = dayjs().month()
const date = dayjs().date()

export const tasks: Tasks = {
    [year]: {
        [month]: {
            [date]: [
                {
                    id: 'f3bde478-8c91-4da3-9bae-7269063c1b8d',
                    title: 'to do list',
                    createdAt: '2024-01-02T16:22:32.152Z',
                    tasks: [
                        {
                            id: '1',
                            userId: 'YourUserID',
                            title: 'Embark on the Journey of Knowledge',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'low',
                        },
                        {
                            id: '2',
                            userId: 'YourUserID',
                            title: 'Conquer the Mountain of Challenges',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'low',
                        },
                        {
                            id: '3',
                            userId: 'YourUserID',
                            title: 'Cultivate the Garden of Relationships',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'low',
                        },
                    ],
                },
                {
                    id: 'a0b3e7cf-2d95-4f06-bfc1-8c65a98d7e9a',
                    title: 'progress list',
                    createdAt: '2024-01-02T16:22:32.152Z',
                    tasks: [
                        {
                            id: '4',
                            userId: 'YourUserID',
                            title: 'Building the Bridge of Understanding',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'high',
                        },
                        {
                            id: '5',
                            userId: 'YourUserID',
                            title: 'Crafting the Magnum Opus of Creativity',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'high',
                        },
                        {
                            id: '6',
                            userId: 'YourUserID',
                            title: 'Nurturing the Flame of Resilience',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'high',
                        },
                    ],
                },
                {
                    id: '6f847258-93b2-4ec9-81fb-57111d0a1f27',
                    title: 'done list',
                    createdAt: '2024-01-02T16:22:32.152Z',
                    tasks: [
                        {
                            id: '7',
                            userId: 'YourUserID',
                            title: 'Master the Art of Time Management',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'medium',
                        },
                        {
                            id: '8',
                            userId: 'YourUserID',
                            title: 'Explore the Uncharted Territory of Knowledge',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'medium',
                        },
                        {
                            id: '9',
                            userId: 'YourUserID',
                            title: 'Cultivate the Habit of Gratitude',
                            start: '10:00',
                            end: '20:00',
                            createdAt: '2024-01-02T16:22:32.152Z',
                            priority: 'medium',
                        },
                    ],
                },
            ],
        },
    },
}
