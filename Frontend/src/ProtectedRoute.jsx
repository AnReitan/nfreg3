// src/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const bruker = sessionStorage.getItem('bruker');
  return bruker ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
