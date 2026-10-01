import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="bg-brandBg min-h-[70vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20 w-full flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 text-center md:text-left">
          <p className="text-orangeBtn uppercase tracking-widest font-semibold mb-4">Your Premium Laundry Partner</p>
          <h1 className="text-4xl md:text-5xl font-black text-brand mb-4">Fresh Clothes, Zero Hassle.</h1>
          <p className="text-brandLight mb-8">Compare and book nearby laundry partners through one platform. Pickup, cleaning, and delivery — all in one place.</p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link to="/signup" className="bg-orangeBtn text-white px-6 py-3 rounded-lg">Get Started Now</Link>
            <Link to="/login" className="bg-white border border-brand px-6 py-3 rounded-lg">Login</Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="hero-img-wrapper rounded-2xl overflow-hidden">
            <img src="/hero.png" alt="hero" />
          </div>
        </div>
      </div>
    </div>
  )
}
