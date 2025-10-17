// src/pages/Register.jsx

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password)
      navigate('/login') // Redirect to login page after successful registration
    } catch (err) {
      setError(err?.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 p-6">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-800">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Securely store and manage your passwords.</p>
        </header>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 hover:bg-sky-700 active:scale-95 px-4 py-2 text-white font-semibold shadow-sm transition-transform disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-medium hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register