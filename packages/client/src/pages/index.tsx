import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import NotFound from "./notFound"
import dashboardRoutes, { defaultRoute } from "@/features/dashboard/routes"
import PrivateRoute from "@/components/privateRoute"
import Home from "./home"
import Login from "./login"
import Signup from "./signup"
import Dashboard from "./dashboard"
import RedirectAuthenticatedRoute from "@/components/redirectAuthenticatedRoute"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks"
import { getUserDataAsync } from "@/redux/userSlice"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />,
    },
    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: <RedirectAuthenticatedRoute component={Login} />
            },
            {
                path: "signup",
                element: <RedirectAuthenticatedRoute component={Signup} />
            },
            {
                path: "*",
                element: <Navigate to="/auth/login" />
            }
        ]
    },
    {
        path: "/dashboard",
        element: <PrivateRoute component={Dashboard} />,
        children: [
            ...dashboardRoutes,
            defaultRoute
        ]
    }
])

const Router = () => {
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector(state => state.user.isLoading)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        const fetchUserData = async () => {
            console.log('this should happend once');

            await dispatch(getUserDataAsync())
        }
        fetchUserData()
    }, [dispatch, isLoggedIn])

    if (isLoading) {
        return <>
            the app is loading...
        </>
    }
    return <RouterProvider router={router} />
}


export default Router