import React from 'react'
import { FaLock } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="w-full h-[9vh] bg-blue-950 text-white flex items-center justify-between px-8 shadow-md">
      <div className="flex items-center gap-3">
        <FaLock className="text-yellow-400 text-2xl" />
        <span className="font-bold text-xl tracking-wide">Password Manager</span>
      </div>
      <span className="hidden md:block text-sm text-blue-200">Secure & Simple</span>
    </nav>
  )
}

export default Navbar
