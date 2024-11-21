// src/components/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextBase';

const PrivateRoute = () => {
  const { isLoggedIn } = useContext(AuthContext);

  // Render children if logged in, otherwise redirect to login page
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
