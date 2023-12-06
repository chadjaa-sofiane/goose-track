import { useAppSelector } from "@/hooks/reduxHooks"
import React from "react"
import { Navigate } from "react-router-dom"

interface RedirectAuthenticatedRouteProps {
    component: React.FC
}

const RedirectAuthenticatedRoute = ({ component: Component }: RedirectAuthenticatedRouteProps) => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    return !isLoggedIn ? <Component /> : <Navigate to="/dashboard/account" />
}

export default RedirectAuthenticatedRoute