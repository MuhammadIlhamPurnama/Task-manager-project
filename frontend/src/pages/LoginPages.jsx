import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import Swal from "sweetalert2"
import http from '../lib/http'

const LoginPages = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  function handleChange(e) {
    setForm({...form, [e.target.name]: e.target.value})
  }

  async function handleLogin(e) {
    e.preventDefault()

    try {
      const response = await http.post('/users/login', form)

      Swal.fire({
        title: 'Success!',
        text: "Success Login",
        icon: 'success',
        confirmButtonText: 'Close'
      })

      localStorage.setItem('access_token', response.data.access_token)

      navigate('/')
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#545454] via-[#0d0d0d] to-[#545454] text-white px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="w-full max-w-sm sm:max-w-md bg-[#1f1f1f]/80 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 border border-white/10 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-silver-200">Welcome Back</h2>
        <p className="text-xs sm:text-sm text-center text-gray-400 mb-6 sm:mb-8">
          Login to your account to continue
        </p>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#2a2a2a] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="you@example.com"
              onChange={handleChange}
              name="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#2a2a2a] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="********"
              onChange={handleChange}
              name="password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-400 hover:bg-slate-300 transition-colors py-2 sm:py-3 rounded-md font-semibold text-black mt-4 text-sm sm:text-base"
          >
            Sign In
          </button>
        </form>
        
      </div>
    </div>
  )
}

export default LoginPages