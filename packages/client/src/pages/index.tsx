import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./home"
import NotFound from "./notFound"
import Login from "./login"
import Signup from "./signup"
import Dashboard from "./dashboard"
import DashboardRoutes from "@/features/dashboard/routes"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />
    },
    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "signup",
                element: <Signup />
            }
        ]
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        children: DashboardRoutes
    }
])

const Router = () => {
    return <RouterProvider router={router}></RouterProvider>
}


export default Router