import { useAppSelector } from '@/hooks/reduxHooks';
// import React, from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRoute {
    component: React.FC

}
const PrivateRoute = ({ component: Component }: PrivateRoute) => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    return isLoggedIn ? <Component /> : <Navigate to="/auth/login" />
};

export default PrivateRoute;