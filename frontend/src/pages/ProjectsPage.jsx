import React, { useEffect, useState } from 'react'
import http from '../lib/http'
import ProjectModal from '../components/ProjectModal'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router'

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'on hold':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div 
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>
          <span className="font-medium">Start:</span> {formatDate(project.startDate)}
        </div>
        {project.endDate && (
          <div>
            <span className="font-medium">End:</span> {formatDate(project.endDate)}
          </div>
        )}
      </div>
      {project.Members && project.Members.length > 0 && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs text-gray-500">{project.Members.length} member{project.Members.length > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}

const ProjectsPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [projects, setProjects] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Pagination & Filter states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [limit] = useState(6)
  const [sortBy, setSortBy] = useState('-createdAt')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit
      })

      if (sortBy) params.append('sort', sortBy)
      if (statusFilter) params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await http.get(`/projects?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      setProjects(response.data.projects || [])
      setTotalPages(response.data.pagination.totalPages)
      setTotalItems(response.data.pagination.totalItems)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [currentPage, sortBy, statusFilter, searchQuery])

  const handleCreateProject = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        status: formData.status
      }

      if (formData.endDate) {
        payload.endDate = formData.endDate
      }

      await http.post('/projects', payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      Swal.fire({
        title: 'Success!',
        text: 'Project created successfully',
        icon: 'success',
        confirmButtonText: 'Close'
      })

      setIsModalOpen(false)
      setCurrentPage(1)
      loadProjects()
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create project',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
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
    setStatusFilter('')
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
        <div className="text-gray-600">Loading projects...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {projects.length} of {totalItems} projects
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          + New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or description..."
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
              <option value="startDate">Start Date (Earliest)</option>
              <option value="-startDate">Start Date (Latest)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || statusFilter || sortBy !== '-createdAt') && (
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

      {/* Projects Grid */}
      {projects.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
          )}
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 mb-2">No projects found</p>
          <p className="text-sm text-gray-500">
            {searchQuery || statusFilter 
              ? 'Try adjusting your filters or search query'
              : 'Create your first project to get started'
            }
          </p>
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </>
  )
}

export default ProjectsPage