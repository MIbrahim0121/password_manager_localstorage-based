// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  // On initial load, check if a user is already logged in from a previous session
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Function to register a new user
  const register = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    const userExists = users.some(user => user.email === email)

    if (userExists) {
      throw new Error('User with this email already exists!')
    }

    const newUser = { email, password }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    return newUser
  }

  // Function to log in a user
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      setCurrentUser(user)
      return user
    } else {
      throw new Error('Invalid email or password.')
    }
  }

  // Function to log out the current user
  const logout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}