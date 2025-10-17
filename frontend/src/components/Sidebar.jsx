import React from 'react'
import { NavLink, useNavigate } from 'react-router'
import Swal from 'sweetalert2'

const SidebarItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `w-full text-left px-4 py-3 rounded-md transition block ${
        isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    {children}
  </NavLink>
)

const Sidebar = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      // Clear token from localStorage
      localStorage.removeItem('access_token')
      
      Swal.fire({
        title: 'Logged out!',
        text: 'You have been logged out successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })

      // Redirect to login page
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    }
  }

  return (
    <aside className="lg:col-span-1 bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Workspace</h3>
        <p className="text-sm text-gray-500">Overview & navigation</p>
      </div>

      <div className="space-y-2">
        <SidebarItem to="/">Dashboard</SidebarItem>
        <SidebarItem to="/projects">Projects</SidebarItem>
        <SidebarItem to="/members">Members</SidebarItem>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-md transition text-red-600 hover:bg-red-50 font-medium"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </div>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar