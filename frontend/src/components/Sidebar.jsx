import React from 'react'
import { NavLink } from 'react-router'

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
      </div>
    </aside>
  )
}

export default Sidebar