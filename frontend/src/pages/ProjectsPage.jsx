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
    <div  onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer">
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
    </div>
  )
}

const ProjectsPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [projects, setProjects] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await http.get('/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      setProjects(response.data.projects || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      loadProjects()
    }
    return () => { isMounted = false }
  }, [])

  const handleCreateProject = async (formData) => {
    try {
      // Format data sesuai backend
      const payload = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        status: formData.status
      }

      // Hanya kirim endDate jika ada
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
      loadProjects() // Reload projects
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create project',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  if (loading) {
    return <div>Loading projects…</div>
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium hover:cursor-pointer"
        >
          + New Project
        </button>
      </div>

      {projects.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600">No projects found</p>
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