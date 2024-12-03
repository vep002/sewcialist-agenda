<template>
  <div class="max-w-md m-auto py-10">
    <v-alert class="text-red" v-if="error">{{ error }}</v-alert>
    <AppHeader/>
    <hr>
    <v-container>
      <GanttChart :tasks="tasks" />
    </v-container>
    
    <hr>
    
    <h1 class="headline">Your Projects</h1>
    <v-row>
      <v-col v-for="project in projects" :key="project.id" :project="project">
        <v-card class="pa-4 project-card">
          <v-card-text>
            <v-card-title>{{ project.title }}</v-card-title>
            <p>{{ project.description }}</p>
            <p>Status: {{ this.getStatusText(project.status)}}</p>
            <h3>Steps</h3>
            <div class="steps-container">
              <v-list class="step-list" dense>
                <v-list-item v-for="step in project.steps" :key="step.id">
                  <v-list-item-content>
                    <v-list-item-title>{{ step.description }}</v-list-item-title>
                    <v-list-item-subtitle>Start: {{ step.start_date }}</v-list-item-subtitle>
                    <v-list-item-subtitle> End: {{ step.end_date }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Completed: {{ step.completed }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="editProject(project.id)" class="edit-btn">
              <v-icon left>mdi-pencil</v-icon> Edit
            </v-btn>
            <v-btn @click="deleteProject(project.id)" class="delete-btn">
              <v-icon left>mdi-delete</v-icon> Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import api from '@/services/api'
import GanttChart from '@/components/GanttChart.vue'
import AppHeader from '@/components/AppHeader.vue'

export default {
  data() {
    return {
      projects: [],
      error: null,
      tasks: [],
    }
  },
    mounted() {
        // Fetch projects for the user using the userId prop
        this.fetchProjects()
    },
    methods: {
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
      getStatusText (status) {
        switch (status) {
          case 0 : return 'Pending'
          case 1 : return 'In Progress'
          case 2 : return 'Completed'
          default: return 'Unknown'
        }
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
    }
  }

</script>

<style>
@import '../assets/styles/styles.css';

.max-w-md {
  background-color: #f5f5dc;
}

.v-container {
  margin-bottom: 40px;
}

.steps-container {
  max-height: 120px;
  overflow-y: auto;
  padding-right: 10px;
}

.project-card, .material-card {
  background-color: #e4eedd;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  padding: 10px;
}

.project-card:hover, .material-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

.project-card .v-list-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 10px;
}

.v-row {
  gap: 20px;
}

.v-card-title {
  font-size: 20px;
  font-weight: bold;
  font-family: 'Merriweather', serif;
  color: #3d3d29;
}

.v-card-text p {
  font-size: 16px;
  font-family: 'Merriweather', serif;
  color: #5a5a42;
}

.v-card-actions {
  margin-top: auto;
}

h3 {
  font-size: 16px !important;
  color: #3d3d29 !important;
}

.step-list {
  background-color: #e4eedd !important;
}

.v-btn {
    border-radius: 10px;
    padding: 10px 20px;
    margin-right: 10px;
  }

.headline {
  font-size: 30px;
  font-weight: bold;
  color: #4e4e33;
  margin-bottom: 20px;
  border-bottom: 2px solid #9caf88;
  padding-bottom: 10px;
}
</style>
