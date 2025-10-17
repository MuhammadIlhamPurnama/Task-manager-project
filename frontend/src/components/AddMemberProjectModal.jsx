import React, { useState, useEffect } from 'react'
import http from '../lib/http'

const AddMemberProjectModal = ({ isOpen, onClose, onSubmit, currentMembers = [] }) => {
  const [loading, setLoading] = useState(false)
  const [allMembers, setAllMembers] = useState([])
  const [selectedMemberId, setSelectedMemberId] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadMembers()
    }
  }, [isOpen])

  const loadMembers = async () => {
    setLoading(true)
    try {
      const response = await http.get('/members', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      setAllMembers(response.data.members || [])
    } catch (error) {
      console.error('Failed to load members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedMemberId) {
      onSubmit(selectedMemberId)
      setSelectedMemberId('')
    }
  }

  const handleClose = () => {
    setSelectedMemberId('')
    onClose()
  }

  // Filter members yang belum ada di project
  const availableMembers = allMembers.filter(
    member => !currentMembers.some(cm => cm.id === member.id)
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading members...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-1">
                Select Member <span className="text-red-500">*</span>
              </label>
              <select
                id="memberId"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a member</option>
                {availableMembers.length > 0 ? (
                  availableMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </option>
                  ))
                ) : (
                  <option disabled>No available members</option>
                )}
              </select>
              {availableMembers.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">All members are already in this project</p>
              )}
            </div>

            {selectedMemberId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Selected:</span>{' '}
                  {allMembers.find(m => m.id === Number(selectedMemberId))?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {allMembers.find(m => m.id === Number(selectedMemberId))?.email}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedMemberId || availableMembers.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Member
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddMemberProjectModal