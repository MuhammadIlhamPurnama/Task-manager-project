import React, { useEffect, useState } from 'react'
import http from '../lib/http'

const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const response = await http.get('/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        if (!isMounted) return
        setSummary(response.data)
      } catch (err) {
        if (!isMounted) return
        setError(err.response?.data?.message || err.message || 'Failed to load')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  const totals = summary?.totals || { totalProjects: 0, totalTasks: 0 }
  const tasksByStatus = summary?.tasksByStatus || []
  const topMembers = summary?.topMembers || []

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your workspace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-500 mb-1">Total Projects</div>
          <div className="text-3xl font-bold text-gray-900">{totals.totalProjects}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-500 mb-1">Total Tasks</div>
          <div className="text-3xl font-bold text-gray-900">{totals.totalTasks}</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Status</h3>
          
          {tasksByStatus.length ? (
            <div className="space-y-3">
              {tasksByStatus.map((task) => (
                <div 
                  key={task.status} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{task.status}</span>
                  <span className="text-lg font-bold text-gray-900">{task.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No tasks yet</div>
          )}
        </div>

        {/* Top Members */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Members</h3>
          
          {topMembers.length ? (
            <div className="space-y-3">
              {topMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{member.tasksCompleted}</div>
                      <div className="text-gray-500">Done</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{member.tasksAssigned}</div>
                      <div className="text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No active members yet</div>
          )}
        </div>
      </div>
    </>
  )
}

export default DashboardPage