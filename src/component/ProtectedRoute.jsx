// src/components/ProtectedRoute.jsx

import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute

ProtectedRoute.propTypes = {
  children: PropTypes.node,
}