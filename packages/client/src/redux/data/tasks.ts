import { Task } from '../calendarSlice'

type Container = {
    order: number
    title: string
    tasks: Task[]
}

export type Tasks = Record<
    string,
    {
        containers: Record<string, Container>
    }
>

export const tasks: Tasks = {
    '2023-11-26': {
        containers: {
            todo: {
                order: 1,
                title: 'to do list',
                tasks: [
                    {
                        id: '1',
                        userId: 'YourUserID',
                        title: 'Embark on the Journey of Knowledge',
                        start: 'Now',
                        end: 'When wisdom is gained',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'low',
                    },
                    {
                        id: '2',
                        userId: 'YourUserID',
                        title: 'Conquer the Mountain of Challenges',
                        start: 'Dawn',
                        end: 'Dusk',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'low',
                    },
                    {
                        id: '3',
                        userId: 'YourUserID',
                        title: 'Cultivate the Garden of Relationships',
                        start: 'Today',
                        end: 'Endless',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'low',
                    },
                ],
            },
            inProgressList: {
                order: 2,
                title: 'progress list',
                tasks: [
                    {
                        id: '4',
                        userId: 'YourUserID',
                        title: 'Building the Bridge of Understanding',
                        start: 'Yesterday',
                        end: 'Tomorrow',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'high',
                    },
                    {
                        id: '5',
                        userId: 'YourUserID',
                        title: 'Crafting the Magnum Opus of Creativity',
                        start: 'Last week',
                        end: 'Future unknown',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'high',
                    },
                    {
                        id: '6',
                        userId: 'YourUserID',
                        title: 'Nurturing the Flame of Resilience',
                        start: 'This month',
                        end: 'To be determined',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'high',
                    },
                ],
            },
            doneList: {
                order: 3,
                title: 'done list',
                tasks: [
                    {
                        id: '7',
                        userId: 'YourUserID',
                        title: 'Master the Art of Time Management',
                        start: 'Sometime past',
                        end: 'Now',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'medium',
                    },
                    {
                        id: '8',
                        userId: 'YourUserID',
                        title: 'Explore the Uncharted Territory of Knowledge',
                        start: 'Previously',
                        end: 'Present',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'medium',
                    },
                    {
                        id: '9',
                        userId: 'YourUserID',
                        title: 'Cultivate the Habit of Gratitude',
                        start: 'Earlier',
                        end: 'Now',
                        date: '2023-12-23T17:59:23.819Z',
                        priority: 'medium',
                    },
                ],
            },
        },
    },
}
