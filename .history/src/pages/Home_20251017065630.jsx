// src/pages/Home.jsx

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  
  // State for user-specific data (e.g., a note)
  const [note, setNote] = useState('')

  // Load user's note from localStorage when the component mounts
  useEffect(() => {
    if (currentUser) {
      const savedNote = localStorage.getItem(`note_${currentUser.email}`)
      if (savedNote) {
        setNote(savedNote)
      }
    }
  }, [currentUser])

  // Save note to localStorage
  const handleSaveNote = () => {
    if (currentUser) {
      localStorage.setItem(`note_${currentUser.email}`, note)
      alert('Note saved!')
    }
  }
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <h2>Welcome Home!</h2>
      <p><strong>Email:</strong> {currentUser?.email}</p>
      
      <hr/>
      
      <h4>Your Private Note</h4>
      <textarea 
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="4" 
        cols="50"
        placeholder="Write something that will be saved in your browser..."
      ></textarea>
      <br/>
      <button onClick={handleSaveNote}>Save Note</button>
      
      <hr/>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home