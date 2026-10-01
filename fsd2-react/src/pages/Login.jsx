import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
      const res = await login({email,password})
      if(res.success){
        localStorage.setItem('currentUser', JSON.stringify(res.user))
        navigate('/')
      } else {
        setError(res.message || 'Invalid credentials')
      }
    }catch(err){ setError('Unable to connect') }
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-brand mb-2">Welcome Back</h2>
        <p className="text-sm text-brandLight mb-6">Enter your credentials to access your account</p>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border px-4 py-3 rounded-lg" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border px-4 py-3 rounded-lg" />
          <button className="w-full bg-orangeBtn text-white py-3 rounded-lg">Login</button>
        </form>
      </div>
    </div>
  )
}
