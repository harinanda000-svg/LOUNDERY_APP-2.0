import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users')||'[]')
    if(users.some(u=>u.email===email)) return alert('User exists')
    const newUser = {name,email,password}
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    navigate('/')
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-brand mb-2">Create an Account</h2>
        <p className="text-sm text-brandLight mb-6">Join us for a hassle-free laundry experience</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full border px-4 py-3 rounded-lg" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border px-4 py-3 rounded-lg" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border px-4 py-3 rounded-lg" />
          <button className="w-full bg-brand text-white py-3 rounded-lg">Sign Up</button>
        </form>
      </div>
    </div>
  )
}
