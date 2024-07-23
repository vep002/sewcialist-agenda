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
        }


    }