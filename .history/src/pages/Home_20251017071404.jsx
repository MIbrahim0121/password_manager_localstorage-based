// src/pages/Home.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  // Password manager state: entries stored per-user in localStorage
  const [entries, setEntries] = useState([])
  const [website, setWebsite] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  const storageKey = currentUser ? `pm_${currentUser.email}` : null

  // Load entries for current user
  useEffect(() => {
    if (!storageKey) {
      setEntries([])
      return
    }
    try {
      const raw = localStorage.getItem(storageKey)
      const parsed = raw ? JSON.parse(raw) : []
      setEntries(parsed)
    } catch {
      setEntries([])
    }
  }, [storageKey])

  // Helper to persist entries
  const persist = (next) => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Add or update an entry
  const handleAddOrUpdate = (e) => {
    e.preventDefault()
    if (!website.trim() || !usernameInput.trim() || !passwordInput.trim()) {
      setMessage('Please fill all fields')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    if (editingId) {
      const next = entries.map((it) => (it.id === editingId ? { ...it, website: website.trim(), username: usernameInput.trim(), password: passwordInput } : it))
      setEntries(next)
      persist(next)
      setMessage('Updated')
    } else {
      const newEntry = { id: Date.now().toString(), website: website.trim(), username: usernameInput.trim(), password: passwordInput }
      const next = [newEntry, ...entries]
      setEntries(next)
      persist(next)
      setMessage('Saved')
    }

    // reset form
    setWebsite('')
    setUsernameInput('')
    setPasswordInput('')
    setEditingId(null)
    setTimeout(() => setMessage(''), 1400)
  }

  const handleEdit = (entry) => {
    setWebsite(entry.website)
    setUsernameInput(entry.username)
    setPasswordInput(entry.password)
    setEditingId(entry.id)
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this entry?')) return
    const next = entries.filter((e) => e.id !== id)
    setEntries(next)
    persist(next)
    setMessage('Deleted')
    setTimeout(() => setMessage(''), 1200)
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setMessage('Password copied')
      setTimeout(() => setMessage(''), 1200)
    } catch {
      setMessage('Unable to copy')
      setTimeout(() => setMessage(''), 1200)
    }
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-slate-800">Your saved passwords</h3>
                <p className="mt-1 text-sm text-slate-500">Stored locally in your browser for this demo.</p>
              </div>
              <div className="text-sm text-green-600">{message}</div>
            </div>

            <form onSubmit={handleAddOrUpdate} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website (e.g. example.com)"
                className="rounded-md border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 w-full"
              />

              <input
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Username / Email"
                className="rounded-md border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 w-full"
              />

              <div className="flex gap-2">
                <input
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password"
                  className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
                <button type="submit" className="rounded-md bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 font-medium">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>

            {/* List of saved entries */}
            <div className="mt-6">
              {entries.length === 0 ? (
                <div className="text-sm text-slate-500">No passwords saved yet.</div>
              ) : (
                <ul className="space-y-3">
                  {entries.map((entry) => (
                    <li key={entry.id} className="p-3 rounded-md border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-800">{entry.website}</div>
                        <div className="text-sm text-slate-500">{entry.username}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => handleCopy(entry.password)} className="text-sm text-sky-600 hover:underline">Copy</button>
                        <button onClick={() => handleEdit(entry)} className="text-sm text-amber-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(entry.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Home