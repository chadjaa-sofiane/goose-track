import { Navigate, type RouteObject } from 'react-router-dom'
import UserCheckIcon from './assets/user-check.svg?react'
import CalendarIcon from './assets/calendar-check.svg?react'
import ChartIcon from './assets/chart.svg?react'
import Statistics from './statistics'
import { Profile } from './profile'
import Calendar from './calendar/calendar'

export type Route = {
    title: string
    icon: React.ReactElement
    pageTitle: string
} & RouteObject

const routes: Route[] = [
    {
        path: 'account',
        title: 'My account',
        element: <Profile />,
        icon: <UserCheckIcon />,
        pageTitle: 'user profile',
    },
    {
        path: 'calendar',
        title: 'calendar',
        element: <Calendar />,
        icon: <CalendarIcon />,
        pageTitle: 'callendar',
    },
    {
        path: 'statistics',
        title: 'statistics',
        element: <Statistics />,
        icon: <ChartIcon />,
        pageTitle: 'statistics',
    },
]

export const defaultRoute: RouteObject = {
    path: '*',
    element: <Navigate to="/dashboard/account" />,
}

export default routes
