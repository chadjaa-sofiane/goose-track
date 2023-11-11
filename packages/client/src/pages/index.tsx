import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./home"
import NotFound from "./notFound"


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
                element: <> this is the login page </>
            },
            {
                path: "signup",
                element: <> this is the signup page </>
            }
        ]
    }
])

const Router = () => {
    return <RouterProvider router={router}></RouterProvider>
}


export default Router