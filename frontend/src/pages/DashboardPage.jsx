import React, { useEffect, useState } from 'react'
import http from '../lib/http'

const StatCard = ({ title, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <div className="text-xs text-gray-500">{title}</div>
    <div className="text-2xl font-bold mt-1 text-gray-900">{value}</div>
  </div>
)

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
    return <div>Loading dashboard…</div>
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  const totals = summary?.totals || { totalProjects: 0, totalTasks: 0 }
  const tasksByStatus = summary?.tasksByStatus || []
  const membersSummary = summary?.membersSummary || []

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">Last update: just now</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Total Projects" value={totals.totalProjects} />
        <StatCard title="Total Tasks" value={totals.totalTasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tasks by status</h3>
          <ul className="space-y-2">
            {tasksByStatus.length ? (
              tasksByStatus.map((t) => (
                <li key={t.status} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{t.status}</div>
                  <div className="text-sm font-medium text-gray-900">{t.count}</div>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No tasks</li>
            )}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Members summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500">
                  <th className="py-2">Name</th>
                  <th className="py-2">Projects</th>
                  <th className="py-2">Assigned</th>
                  <th className="py-2">Completed</th>
                </tr>
              </thead>
              <tbody>
                {membersSummary.length ? (
                  membersSummary.map((m) => (
                    <tr key={m.id} className="border-t">
                      <td className="py-2 text-gray-800">{m.name}</td>
                      <td className="py-2 text-gray-700">{m.projectsCount}</td>
                      <td className="py-2 text-gray-700">{m.tasksAssigned}</td>
                      <td className="py-2 text-gray-700">{m.tasksCompleted}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="py-2 text-gray-500">No members</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage