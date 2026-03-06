import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import NotFound from './notFound'
import dashboardRoutes, { defaultRoute } from '@/features/dashboard/routes'
import Home from './home'
import Login from './login'
import Signup from './signup'
import Dashboard from './dashboard'
import RequireGuest from '@/components/requireGuest'
import RequireAuth from '@/components/requireAuth'
import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { getUserDataAsync } from '@/redux/userSlice'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <NotFound />,
    },
    {
        path: '/auth',
        element: <RequireGuest />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'signup',
                element: <Signup />,
            },
            {
                path: '*',
                element: <Navigate to="/auth/login" />,
            },
        ],
    },
    {
        path: '/dashboard',
        element: <RequireAuth />,
        children: [
            {
                element: <Dashboard />,
                children: [...dashboardRoutes, defaultRoute],
            },
        ],
    },
])

const Router = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchUserData = async () => {
            await dispatch(getUserDataAsync())
        }
        fetchUserData()
    }, [dispatch])

    return <RouterProvider router={router} />
}

export default Router
