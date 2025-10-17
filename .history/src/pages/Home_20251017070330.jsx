// src/pages/Home.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  // State for user-specific data (e.g., a note)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

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
    if (!currentUser) return
    setSaving(true)
    try {
      localStorage.setItem(`note_${currentUser.email}`, note)
      // small success cue
      setTimeout(() => setSaving(false), 500)
    } catch {
      setSaving(false)
      alert('Failed to save note')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-800">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-600">Signed in as <span className="font-medium text-slate-800">{currentUser?.email}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium shadow-sm">
              Logout
            </button>
          </div>
        </div>

        <main className="mt-6">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-medium text-slate-800">Your private note</h3>
            <p className="mt-1 text-sm text-slate-500">Only stored in your browser for this demo.</p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={6}
              className="mt-4 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Write something that will be saved in your browser..."
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSaveNote}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 font-medium shadow-sm disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save note'}
              </button>

              <span className="text-sm text-slate-500">Autosave isn&apos;t enabled in this demo.</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Home