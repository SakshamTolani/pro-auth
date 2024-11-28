import React, { useContext } from 'react'
import { Route, Navigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext"

const PrivateRoute = ({ children }) => {
    let { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default PrivateRoute