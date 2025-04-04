import React from 'react'
import { Inter } from 'next/font/google'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const aboutUs = () => {
  return (
    <div className="text-white">
      <Navbar/>
      {/* Background Decoration */}
      <div className="blob top-right"></div>
      <div className="blob top-left animation-delay-2000"></div>

      <div className="min-h-screen flex items-center justify-center">aboutUs</div>
      <Footer/>
    </div>
  )
}

export default aboutUs