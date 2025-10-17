import React, { useEffect, useState } from 'react'
import http from '../lib/http'
import MemberModal from '../components/MemberModal'
import Swal from 'sweetalert2'

const MembersPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [members, setMembers] = useState([])
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const loadMembers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await http.get('/members', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      setMembers(response.data.members || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleCreateMember = async (formData) => {
    try {
      await http.post('/members', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      Swal.fire({
        title: 'Success!',
        text: 'Member created successfully',
        icon: 'success',
        confirmButtonText: 'Close'
      })

      setIsMemberModalOpen(false)
      loadMembers()
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create member',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  const handleUpdateMember = async (formData) => {
    try {
      await http.put(`/members/${selectedMember.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      Swal.fire({
        title: 'Success!',
        text: 'Member updated successfully',
        icon: 'success',
        confirmButtonText: 'Close'
      })

      setIsMemberModalOpen(false)
      setSelectedMember(null)
      setIsEditMode(false)
      loadMembers()
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update member',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  const handleDeleteMember = async (memberId, memberName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete member "${memberName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await http.delete(`/members/${memberId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })

        Swal.fire({
          title: 'Deleted!',
          text: 'Member has been deleted successfully',
          icon: 'success',
          confirmButtonText: 'Close'
        })

        loadMembers()
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete member',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }
    }
  }

  const handleEditClick = (member) => {
    setSelectedMember(member)
    setIsEditMode(true)
    setIsMemberModalOpen(true)
  }

  const handleOpenNewMemberModal = () => {
    setSelectedMember(null)
    setIsEditMode(false)
    setIsMemberModalOpen(true)
  }

  const handleCloseMemberModal = () => {
    setIsMemberModalOpen(false)
    setSelectedMember(null)
    setIsEditMode(false)
  }

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
        <button
          onClick={handleOpenNewMemberModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          + New Member
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">All Members</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length ? members.map((member, index) => (
                <tr key={member.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-2 text-gray-700">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold text-xs">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-700">{member.email}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(member)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No members found. Add your first member!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
        onSubmit={isEditMode ? handleUpdateMember : handleCreateMember}
        initialData={selectedMember ? {
          name: selectedMember.name,
          email: selectedMember.email,
          role: selectedMember.role
        } : null}
        isEdit={isEditMode}
      />
    </>
  )
}

export default MembersPage