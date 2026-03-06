import { useAppSelector } from '@/hooks/reduxHooks'
import { Navigate, Outlet } from 'react-router-dom'

const RequireAuth = () => {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
    const isBootstrapped = useAppSelector((state) => state.auth.isBootstrapped)

    if (!isBootstrapped) {
        return <div className="px-6 py-10 text-sm text-text/70">Loading...</div>
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" replace />
}

export default RequireAuth
