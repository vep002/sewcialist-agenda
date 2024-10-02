<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>

    <hr>
    <GanttChart :tasks="tasks" />
    <hr>
    <button @click="handleLogout">Logout</button>
    <h1>Your Projects</h1>
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
    <div>
      <h1>Your Materials Inventory</h1>
      <ul>
        <li v-for="material in materials" :key="material.id" :material="material">
          <p>{{ material.name }}</p>
          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" v-model="material.quantity" min="0" @change="updateMaterial(material)">
        </li>
      </ul>
    </div>
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
      tasks: [],
      materials: []
    }
  },
    mounted() {
        // Fetch projects for the user using the userId prop
        this.fetchProjects()
        this.fetchMaterials()
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
      async fetchMaterials() {
        try {
          const token = localStorage.getItem('authToken')
          if(token) {
            const response = await api.getMaterials(token)
            this.materials = response.data
          }
        } catch (error) {
          console.error('Error fetching materials: ', error)
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
      },
      async deleteMaterial(materialId) {
        try {
          const token = localStorage.getItem('authToken')
          await api.deleteMaterial(materialId, token)
          this.fetchMaterials() // Refresh the list of materials
        } catch (error) {
          this.error = 'Error deleting material: ' + error.response.data.message
          console.error('Error deleting material:', error)
        }
      },
      async updateMaterial(material) {
        const token = localStorage.getItem('authToken')

        if (material.quantity === 0) {
          await this.deleteMaterial(material.id)
        } else {
          try {
            const response = await api.updateMaterial(material.id, { quantity: material.quantity }, token)
          } catch (error) {
            this.error = 'Error updating material: ' + error.response.data.message
            console.error('Error updating material:', error)}
        }
      }
    }
  }

</script>

<style scoped>
</style>

<!-- <v-btn class="mt-4" color="primary" block @click="handleLogout">Log out</v-btn> -->