<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>

    <hr>
    <GanttChart :tasks="tasks" />
    <hr>
    <button @click="handleLogout">Logout</button>
    <ul>
      <li v-for="project in projects" :key="project.id" :project="project">
        <p>{{ project.name }}</p>
        <p>{{ project.description }}</p>
        <p>{{ project.status }}</p>
        <ol>
          <li v-for="step in project.steps" :key="step.id">
            <p>{{ step.description }}</p>
            <p>{{ step.start_date }}</p>
            <p>{{ step.end_date }}</p>
            <p>{{ step.completed }}</p>
          </li>
        </ol>
        <button @click="editProject(project.id)">Edit</button>
        <button @click="deleteProject(project.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '@/services/api'
import GanttChart from '@/components/GanttChart.vue'

export default {
  data() {
    return {
      projects: [],
      error: null,
      tasks: []
    }
  },
    mounted() {
        // Fetch projects for the user using the userId prop
        this.fetchProjects()
    },
    methods: {
      async handleLogout() {
        try {
          const token = localStorage.getItem('authToken')
          if(token) {
            await api.logout(token)
            localStorage.removeItem('authToken')
            this.$router.replace('/')
          }
        } catch (error) {
          console.error('Error logging out user: ', error)
        }
      },
      async fetchProjects() {
        try {
          const token = localStorage.getItem('authToken')
          if(token) {
            const response = await api.getProjects(token)
            this.projects = response.data
            this.prepareTasks()
          }
        } catch (error) {
          console.error('Error fetching projects: ', error)
        }
      },
      prepareTasks() {
        this.tasks = this.projects.flatMap(project => 
          project.steps.map(step => ({
            id: step.id,
            name: step.description, 
            start: this.formatDate(step.start_date), 
            end: this.formatDate(step.end_date),
            progress: step.completed ? 100 : 0,
            dependencies: []
          }))
          )
      },
      formatDate(date) {
        if (!date) return null
        return new Date(date).toISOString().split('T')[0]
      },
      async deleteProject(projectId) {
        try {
          const token = localStorage.getItem('authToken')
          await api.deleteProject(projectId, token)
          this.fetchProjects() // Refresh the list of projects
        } catch (error) {
          this.error = 'Error deleting project: ' + error.response.data.message
          console.error('Error deleting project:', error)
        }
      },
      editProject(projectId) {
        console.log('Editing project with ID:', projectId); 
        this.$router.push(`/projects/${projectId}`)
      }
    }
  }

</script>

<style scoped>
</style>

<!-- <v-btn class="mt-4" color="primary" block @click="handleLogout">Log out</v-btn> -->