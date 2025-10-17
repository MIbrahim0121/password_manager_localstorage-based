// src/pages/Login.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pinExists, setPinExists] = useState(false)
  const { setAppPin, loginWithPin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('app_pin')
    setPinExists(!!stored)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!pinExists) {
        // set the PIN (must be 6 digits)
        await setAppPin(pin)
        navigate('/home')
      } else {
        await loginWithPin(pin)
        navigate('/home')
      }
    } catch (err) {
      setError(err?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const onChangePin = (value) => {
    // allow only digits and max length 6
    const filtered = value.replace(/\D/g, '').slice(0, 6)
    setPin(filtered)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 p-6">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-800">Unlock your vault</h1>
          <p className="mt-1 text-sm text-slate-500">Enter a 6-digit PIN to continue.</p>
        </header>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <input
              inputMode="numeric"
              value={pin}
              onChange={(e) => onChangePin(e.target.value)}
              placeholder="______"
              className="mx-auto text-center tracking-widest text-lg w-48 rounded-md border border-slate-200 px-3 py-2 focus:outline-none"
            />
            <div className="mt-2 text-sm text-slate-500">{pinExists ? 'Enter your PIN' : 'Create a new 6-digit PIN'}</div>
          </div>

          <button
            type="submit"
            disabled={loading || pin.length !== 6}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 hover:bg-sky-700 active:scale-95 px-4 py-2 text-white font-semibold shadow-sm transition-transform disabled:opacity-60"
          >
            {loading ? 'Please wait...' : pinExists ? 'Unlock' : 'Set PIN'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login