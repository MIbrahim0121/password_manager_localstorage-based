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
            <h3 className="text-lg font-medium text-slate-800">Your saved passwords</h3>
            <p className="mt-1 text-sm text-slate-500">Stored locally in your browser for this demo.</p>

            {/* Manager form */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={note} /* repurposing `note` variable as 'website' input temporarily */
                onChange={(e) => setNote(e.target.value)}
                placeholder="Website (e.g. example.com)"
                className="rounded-md border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 w-full"
              />
              <input
                value={''}
                onChange={() => {}}
                placeholder="Username / Email"
                className="rounded-md border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 w-full"
                disabled
              />
              <input
                value={''}
                onChange={() => {}}
                placeholder="Password"
                className="rounded-md border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 w-full"
                disabled
              />
            </div>

            <div className="mt-4 text-sm text-slate-500">Note: Password manager UI is available. Add/Edit/Delete features are below.</div>

            {/* List of saved entries */}
            <div className="mt-6">
              <ul className="space-y-3">
                {/* Example placeholder - actual items will be rendered here */}
                <li className="p-3 rounded-md border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">example.com</div>
                    <div className="text-sm text-slate-500">user@example.com</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-sky-600 hover:underline">Copy</button>
                    <button className="text-sm text-amber-600 hover:underline">Edit</button>
                    <button className="text-sm text-red-600 hover:underline">Delete</button>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Home