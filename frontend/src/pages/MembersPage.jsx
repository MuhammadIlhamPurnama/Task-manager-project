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

  // Pagination & Filter states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [limit] = useState(10)
  const [sortBy, setSortBy] = useState('-createdAt')
  const [roleFilter, setRoleFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const loadMembers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit
      })

      if (sortBy) params.append('sort', sortBy)
      if (roleFilter) params.append('role', roleFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await http.get(`/members?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      setMembers(response.data.members || [])
      setTotalPages(response.data.pagination.totalPages)
      setTotalItems(response.data.pagination.totalItems)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [currentPage, sortBy, roleFilter, searchQuery])

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
      setCurrentPage(1)
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

        // Jika halaman saat ini kosong setelah delete, pindah ke halaman sebelumnya
        if (members.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          loadMembers()
        }
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

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchInput('')
    setSearchQuery('')
    setSortBy('-createdAt')
    setRoleFilter('')
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading members...</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {members.length} of {totalItems} members
          </p>
        </div>
        <button
          onClick={handleOpenNewMemberModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          + New Member
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or email..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="role">Role (A-Z)</option>
              <option value="-role">Role (Z-A)</option>
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
            <input
              type="text"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="e.g. Engineer, Manager..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || roleFilter || sortBy !== '-createdAt') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Members Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
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
                  <td className="py-3 px-2 text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
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
                    {searchQuery || roleFilter 
                      ? 'No members found. Try adjusting your filters or search query.'
                      : 'No members found. Add your first member!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {/* {totalPages > 1 && ( */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                First
              </button>

              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1
                  // Show first, last, current, and adjacent pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md transition ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="px-2 text-gray-500">...</span>
                  }
                  return null
                })}
              </div>

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>

              {/* Last Page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      {/* )} */}

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