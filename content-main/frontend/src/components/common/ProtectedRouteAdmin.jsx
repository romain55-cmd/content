import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const getUserRole = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded JWT:', decoded); // Debugging line
    return decoded.role;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const ProtectedRouteAdmin = ({ children }) => {
  const location = useLocation();
  const userRole = getUserRole();

  if (userRole !== 'Admin') {
    // Redirect them to the home page if they are not an admin.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRouteAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRouteAdmin;