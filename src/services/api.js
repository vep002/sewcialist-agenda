import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
    })

    export default {
        register(user) {
            return apiClient.post('/signup', { user })
        },

        login(user) {
            return apiClient.post('/login', { user })
        },

        logout(token) {
            return apiClient.delete('/logout', { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
             })
        },

        getProjects(token) {
            return apiClient.get('/projects', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        getMaterials(token) {
            return apiClient.get('/materials', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        getProject(projectId, token) {
            return apiClient.get(`/projects/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        deleteProject(projectId, token) {
            return apiClient.delete(`/projects/${projectId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
        },
        updateProject(projectId, projectData, token) {
            return apiClient.patch(`/projects/${projectId}`, { project: projectData }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
        },

        addStep(projectId, stepData, token) {
            console.log("Project ID being passed to post url: ", projectId)
            return apiClient.post(`/projects/${projectId}/steps`, { step: stepData }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },

        deleteStep(projectId, stepId, token) {
            return apiClient.delete(`projects/${projectId}/steps/${stepId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
        },

        updateStep(projectId, stepId, stepData, token) {
            return apiClient.patch(`projects/${projectId}/steps/${stepId}`, { step: stepData }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
        },
        addExistingMaterialToProject(projectId, materialId, token) {
            return apiClient.post(`projects/${projectId}/materials/${materialId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
        },
        addNewMaterialToProject(projectId, materialData, token) {
            return apiClient.post(`projects/${projectId}/materials`, { material: materialData }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
        },
        deleteMaterial() {
            return apiClient.delete(`materials/${materialId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
        }

    }