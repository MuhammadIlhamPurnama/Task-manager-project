import React, { useEffect, useState } from 'react'
import http from '../lib/http'

const MembersPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    let isMounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const response = await http.get('/dashboard/members/leaderboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        if (!isMounted) return
        setLeaderboard(response.data.leaderboard || [])
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
    return <div>Loading members…</div>
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Members Leaderboard</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2">#</th>
                <th className="py-2">Name</th>
                <th className="py-2">Tasks Assigned</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length ? leaderboard.map((m, i) => (
                <tr key={m.id} className="border-t">
                  <td className="py-2 text-gray-700">{i + 1}</td>
                  <td className="py-2 text-gray-800">{m.name}</td>
                  <td className="py-2 text-gray-700">{m.tasksAssigned}</td>
                </tr>
              )) : (
                <tr><td className="py-2 text-gray-500">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default MembersPage