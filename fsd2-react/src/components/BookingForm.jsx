import React, { useState } from 'react'

export default function BookingForm(){
  const [name,setName] = useState('')
  const [phone,setPhone] = useState('')
  const [email,setEmail] = useState('')
  const [address,setAddress] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    const booking = {name,phone,email,address,date: new Date().toISOString()}
    localStorage.setItem('lastBooking', JSON.stringify(booking))
    alert('Booking saved locally')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow">
      <div>
        <label className="block text-sm font-medium">Customer Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea value={address} onChange={e=>setAddress(e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} />
      </div>
      <button className="bg-brand text-white px-4 py-2 rounded">Submit Booking</button>
    </form>
  )
}
