import { Navigate, type RouteObject } from 'react-router-dom'
import UserCheckIcon from "./assets/user-check.svg?react"
import CallendarIcon from "./assets/calendar-check.svg?react"
import ChartIcon from "./assets/chart.svg?react"
import Account from './account'
import Callendar from './callendar'
import Statistics from './statistics'


export type Route = {
    title: string
    icon: React.ReactElement
    pageTitle: string
} & RouteObject

const routes: Route[] = [
    {
        path: 'account',
        title: "My account",
        element: <Account />,
        icon: <UserCheckIcon />,
        pageTitle: "user profile"
    },
    {
        path: 'callendar',
        title: "callendar",
        element: <Callendar />,
        icon: <CallendarIcon />,
        pageTitle: "callendar"
    },
    {
        path: 'statistics',
        title: "statistics",
        element: <Statistics />,
        icon: <ChartIcon />,
        pageTitle: "statistics"
    }
]

export const defaultRoute: RouteObject = {
    path: "*",
    element: <Navigate to="/dashboard/account" />
}


export default routes
