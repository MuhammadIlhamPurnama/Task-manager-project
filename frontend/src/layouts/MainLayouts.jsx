import React from 'react'
import { Navigate, Outlet } from 'react-router'
import Sidebar from '../components/Sidebar'

const MainLayout = () => {

  if (!localStorage.getItem('access_token')) {
    return <Navigate to='/login' />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Sidebar />
        <main className="lg:col-span-3 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout