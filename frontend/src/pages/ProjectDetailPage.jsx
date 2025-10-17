import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import http from '../lib/http'
import TaskModal from '../components/TaskModal'
import ProjectModal from '../components/ProjectModal'
import AddMemberProjectModal from '../components/AddMemberProjectModal'
import Swal from 'sweetalert2'

const ProjectDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [project, setProject] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isMemberProjectModalOpen, setIsMemberProjectModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isEditTaskMode, setIsEditTaskMode] = useState(false)

  const loadProject = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await http.get(`/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      setProject(response.data.project)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
  }, [id])

  const handleCreateTask = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        startDate: formData.startDate,
        assignedId: Number(formData.assignedId)
      }

      // Hanya kirim endDate jika ada
      if (formData.endDate) {
        payload.endDate = formData.endDate
      }

      await http.post(`/projects/${id}/tasks`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      Swal.fire({
        title: 'Success!',
        text: 'Task created successfully',
        icon: 'success',
        confirmButtonText: 'Close'
      })

      setIsTaskModalOpen(false)
      loadProject() // Reload project data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create task',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  const handleUpdateTask = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        startDate: formData.startDate,
        assignedId: Number(formData.assignedId)
      }

      // Hanya kirim endDate jika ada
      if (formData.endDate) {
        payload.endDate = formData.endDate
      }

      await http.put(`/tasks/${selectedTask.id}`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      Swal.fire({
        title: 'Success!',
        text: 'Task updated successfully',
        icon: 'success',
        confirmButtonText: 'Close'
      })

      setIsTaskModalOpen(false)
      setSelectedTask(null)
      setIsEditTaskMode(false)
      loadProject() // Reload project data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update task',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  const handleDeleteTask = async (taskId, taskTitle) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete task "${taskTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await http.delete(`/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })

        Swal.fire({
          title: 'Deleted!',
          text: 'Task has been deleted successfully',
          icon: 'success',
          confirmButtonText: 'Close'
        })

        loadProject() // Reload project data
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete task',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }
    }
  }

  const handleUpdateProject = async (formData) => {
    try {
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

      await http.put(`/projects/${id}`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      Swal.fire({
        title: 'Success!',
        text: 'Project updated successfully',
        icon: 'success',
        confirmButtonText: 'Close'
      })

      setIsEditModalOpen(false)
      loadProject() // Reload project data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update project',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  const handleAddMember = async (memberId) => {
    try {
      await http.post(`/projects/${id}/members`, {
        memberId: Number(memberId)
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      Swal.fire({
        title: 'Success!',
        text: 'Member added to project successfully',
        icon: 'success',
        confirmButtonText: 'Close'
      })

      setIsMemberProjectModalOpen(false)
      loadProject() // Reload project data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add member',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsEditTaskMode(true)
    setIsTaskModalOpen(true)
  }

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false)
    setSelectedTask(null)
    setIsEditTaskMode(false)
  }

  const handleOpenNewTaskModal = () => {
    setSelectedTask(null)
    setIsEditTaskMode(false)
    setIsTaskModalOpen(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in progress':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'under review':
        return 'bg-purple-100 text-purple-700'
      case 'on hold':
      case 'to do':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading project details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={() => navigate('/dashboard/projects')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to Projects
        </button>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Project not found</div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500">Project Overview</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Project Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Project Information</h3>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Description</label>
            <p className="text-gray-900">{project.description}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Duration</label>
            <p className="text-gray-900">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
          <button
            onClick={() => setIsMemberProjectModalOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"
          >
            + Add Member
          </button>
        </div>
        {project.Members && project.Members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.Members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-sm">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No team members assigned</p>
        )}
      </div>

      {/* Tasks Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tasks</h3>
          <button
            onClick={handleOpenNewTaskModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
          >
            + Add Task
          </button>
        </div>

        {project.Tasks && project.Tasks.length > 0 ? (
          <div className="space-y-3">
            {project.Tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition group">
                <div className="flex items-start justify-between mb-2">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => handleTaskClick(task)}
                  >
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTask(task.id, task.title)
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition opacity-0 group-hover:opacity-100"
                      title="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <div className="flex items-center gap-2">
                    {task.Assignee ? (
                      <>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-semibold text-xs">
                            {task.Assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <span>{task.Assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Start:</span> {formatDate(task.startDate)}
                    {task.endDate && (
                      <>
                        {' '}<span className="mx-1">•</span>{' '}
                        <span className="font-medium">End:</span> {formatDate(task.endDate)}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No tasks yet. Add your first task!</p>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSubmit={isEditTaskMode ? handleUpdateTask : handleCreateTask}
        projectMembers={project.Members || []}
        initialData={selectedTask ? {
          title: selectedTask.title,
          description: selectedTask.description,
          status: selectedTask.status,
          startDate: formatDateForInput(selectedTask.startDate),
          endDate: formatDateForInput(selectedTask.endDate),
          assignedId: selectedTask.assignedId
        } : null}
        isEdit={isEditTaskMode}
      />

      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProject}
        initialData={{
          name: project.name,
          description: project.description,
          startDate: formatDateForInput(project.startDate),
          endDate: formatDateForInput(project.endDate),
          status: project.status
        }}
        isEdit={true}
      />

      <AddMemberProjectModal
        isOpen={isMemberProjectModalOpen}
        onClose={() => setIsMemberProjectModalOpen(false)}
        onSubmit={handleAddMember}
        currentMembers={project.Members || []}
      />
    </>
  )
}

export default ProjectDetailPage