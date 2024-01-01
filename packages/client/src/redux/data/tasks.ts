import { Task } from '../calendarSlice'

type Container = {
    // order: number
    title: string
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
    '2023-11-28': {
        containersOrder: ['todo', 'inProgressList', 'doneList'],
        containers: {
            todo: {
                title: 'to do list',
                tasks: [
                    {
                        id: '1',
                        userId: 'YourUserID',
                        title: 'Embark on the Journey of Knowledge',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'low',
                    },
                    {
                        id: '2',
                        userId: 'YourUserID',
                        title: 'Conquer the Mountain of Challenges',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'low',
                    },
                    {
                        id: '3',
                        userId: 'YourUserID',
                        title: 'Cultivate the Garden of Relationships',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'low',
                    },
                ],
            },
            inProgressList: {
                title: 'progress list',
                tasks: [
                    {
                        id: '4',
                        userId: 'YourUserID',
                        title: 'Building the Bridge of Understanding',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'high',
                    },
                    {
                        id: '5',
                        userId: 'YourUserID',
                        title: 'Crafting the Magnum Opus of Creativity',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'high',
                    },
                    {
                        id: '6',
                        userId: 'YourUserID',
                        title: 'Nurturing the Flame of Resilience',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'high',
                    },
                ],
            },
            doneList: {
                title: 'done list',
                tasks: [
                    {
                        id: '7',
                        userId: 'YourUserID',
                        title: 'Master the Art of Time Management',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'medium',
                    },
                    {
                        id: '8',
                        userId: 'YourUserID',
                        title: 'Explore the Uncharted Territory of Knowledge',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'medium',
                    },
                    {
                        id: '9',
                        userId: 'YourUserID',
                        title: 'Cultivate the Habit of Gratitude',
                        start: '10:00',
                        end: '20:00',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'medium',
                    },
                ],
            },
        },
    },
}
