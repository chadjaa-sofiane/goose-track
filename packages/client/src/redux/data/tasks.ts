import { Task } from '../calendarSlice'

type Container = {
    // order: number
    title: string
    createdAt: string
    tasks: Task[]
}

export type Tasks = Record<
    string,
    {
        containersOrder: string[]
        containers: Record<string, Container>
    }
>

export const tasks: Tasks = {
    '2024-0-8': {
        containersOrder: ['todo', 'inProgressList', 'doneList'],
        containers: {
            todo: {
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
            inProgressList: {
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
            doneList: {
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
        },
    },
}
