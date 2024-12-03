<template>
    <div class="max-w-md m-auto py-10">
        <AppHeader />
        <v-btn @click="backToProjectList" class="back-btn">Back to Project List</v-btn>
        <h1 class="headline">{{  project.title  }}</h1>
        <v-btn @click="openEditProjectModal(null)" class="edit-btn">Edit Project Details</v-btn>
        <p>{{ project.description }}</p>
        <p>Status: {{ this.getStatusText(project.status)}}</p>

        <h2 class="subheadline">Steps</h2>
        <v-list>
            <v-list-item v-for="step in project.steps" :key="step.id">
                <v-card class="pa-4 step-card">
                    <v-form @submit.prevent="updateStep(step)">
                        <v-text-field label="Description" v-model="step.description" required></v-text-field>
                        <v-text-field label="Start Date" v-model="step.start_date" type="date"></v-text-field>
                        <v-text-field label="End Date" v-model="step.end_date" type="date"></v-text-field>
                        <v-checkbox label="Completed" v-model="step.completed"></v-checkbox>
                        <v-btn type="submit">Update Step</v-btn>
                    </v-form>
                    <v-btn @click="deleteStep(project.id, step.id)">Delete Step</v-btn>
                </v-card>
            </v-list-item>
        </v-list>
        <v-btn @click="openAddStepModal(null)" class="add-step-btn">Add Step</v-btn>

        <h2 class="subheadline">Materials</h2>
        <v-list>
            <v-list-item v-for="material in project.materials" :key="material.id">
                <v-card class="pa-4 material-card">
                    <p>{{ material.name }}</p>
                    <v-text-field label="Quantity" v-model="material.quantity" type="number" min="0" @change="updateMaterial(material)" outlined dense></v-text-field>
                </v-card>
            </v-list-item>
        </v-list>
        <v-btn @click="openAddMaterialModal()" class="add-material-btn">Add Materials</v-btn>

        <Modal :isModalOpen="isEditProjectModalOpen" @close="closeModals">
            <v-form @submit.prevent="saveProject">
                <h1 class="headline">Edit Project</h1>
                <v-text-field label="Project Title" v-model="project.title" required></v-text-field>
                <v-textarea label="Project Description" v-model="project.description" required></v-textarea>
                <v-select label="Status" v-model="project.status" :items="['Not Started', 'In Progress', 'Completed']"></v-select>
                <v-btn type="submit" class="save-btn">Save</v-btn>
            </v-form>
        </Modal>

        <Modal :isModalOpen="isAddStepModalOpen" @close="closeModals">
            <v-form @submit.prevent="addStep(newStepData)">
                <h1 class="headline">Add Step</h1>
                <!-- Step Edit Form -->
                 <v-text-field label="Description" v-model="step.description" required></v-text-field>
                 <v-text-field label="Start Date" v-model="step.start_date" type="date" required></v-text-field>
                 <v-text-field label="End Date" v-model="step.end_date" type="date" required></v-text-field>
                 <v-checkbox label="Completed" v-model="step.completed"></v-checkbox>
                <v-btn type="submit" class="save-btn">Save</v-btn>
            </v-form>
        </Modal>

        <Modal :isModalOpen="isAddMaterialModalOpen" @close="closeModals">
            <v-form @submit="saveMaterial">
                <h1 class="headline">Add Material</h1>
                <v-select label="Choose from your inventory" v-if="materialsInInventory.length > 0" v-model="selectedMaterialData.name" :items="materialsInInventory.map(m=>m.name)"></v-select>
                <v-text-field label="New Material Name" v-model="newMaterialData.name" required></v-text-field>
                <v-text-field label="Quantity" v-model="newMaterialData.quantity" type="number" required></v-text-field>
                <v-btn type="submit" class="save-btn">Save</v-btn> 
            </v-form>
        </Modal> 
    </div>
</template>

<script>
import api from '@/services/api'

export default {
    data() {
        return {
            userId: '',
            isEditProjectModalOpen: false,
            isAddStepModalOpen: false,
            isAddMaterialModalOpen: false,
            project: {
                title: '',
                description: '',
                status: 0,
                steps: [],
                materials: []
            },
            newStepData: {
            description: '',
            start_date: '',
            end_date: '',
            completed: false
            },
            materialsInInventory: [],
            selectedMaterialData: {
                name: '',
            },
            newMaterialData: {
                name: ''
            },
            error: null
        }
    },
    async created() {
        // Fetch project for the user using the projectId prop
        await this.fetchProject()
        await this.fetchUserMaterials()
        console.log("Project modal open:", this.isEditProjectModalOpen)
        console.log("Step modal open:", this.isAddStepModalOpen)
        console.log("Material modal open:", this.isAddMaterialModalOpen)
    },
    methods: {
        backToProjectList() {
            this.$router.push(`/users/${this.userId}/projects`)
        },
        async fetchProject() {
            try {
                const token = localStorage.getItem('authToken')
                const projectId = this.$route.params.projectID
                const response = await api.getProject(projectId, token)
                this.project = response.data
                console.log('Project:', this.project)
                console.log('Project steps:', this.project.steps)
                console.log('Project materials:', this.project.materials)
                this.userId = response.data.user_id
                console.log('UserId:', this.userId)
            } catch (error) {
                this.error = 'Error fetching project: ' + error.response.data.message
                console.error('Error fetching project:', error)
            }
        },
        async fetchUserMaterials() {
            try {
                const token = localStorage.getItem('authToken')
                const response = await api.getMaterials(token)
                console.log('All materials in inventory:', response.data)
                this.materialsInInventory = response.data
            } catch (error) {
                this.error = 'Error fetching materials: ' + error.response.data.message
                console.error('Error fetching materials:', error)
            }
        },
        getStatusText (status) {
        switch (status) {
          case 0 : return 'Pending'
          case 1 : return 'In Progress'
          case 2 : return 'Completed'
          default: return 'Unknown'
        }
      },
        openEditProjectModal() {
            this.isEditProjectModalOpen = true
        },
        openAddStepModal(step) {
            this.addingStep = step || { description: '', start_date: '', end_date: '', completed: false }
            this.isAddStepModalOpen = true
        },
        openAddMaterialModal() {
            this.isAddMaterialModalOpen = true
        },
        closeModals() {
            this.isEditProjectModalOpen = false
            this.isAddStepModalOpen = false
            this.isAddMaterialModalOpen = false
        },
        async saveProject() {
            try {
                const projectId = this.$route.params.projectID
                const token = localStorage.getItem('authToken')
                const response = await api.updateProject(projectId, this.project, token)
                this.project = response.data
                this.isEditProjectModalOpen = false
            } catch (error) {
                console.error('Error updating project:', error)
                this.error = "Failed to update project. Please try again."

            }
        },
        async deleteStep(projectId, stepId) {
            try {
                const token = localStorage.getItem('authToken')
                await api.deleteStep(projectId, stepId, token)
                this.project.steps = this.project.steps.filter(step => step.id !== stepId)
            } catch (error) {
                this.error = 'Error deleting step: ' + error.response.data.message
                console.error('Error deleting step:', error)
            }
        },
        async addStep(newStepData) {
            try {
                const projectId = this.project.id
                console.log('Project id in addStep method:', projectId)
                const token = localStorage.getItem('authToken')
                const response = await api.addStep(projectId, newStepData, token)
                this.project.steps.push(response.data)
                this.isAddStepModalOpen = false
                this.newStepData = { description: '', start_date: '', end_date: '', completed: false }
            } catch (error) {
                console.error('Error adding step:', error)
                this.error = "Failed to add step. Please try again."

            }
        },
        async updateStep(step) {
            try {
                const projectId = this.project.id
                const token = localStorage.getItem('authToken')
                const response = await api.updateStep(projectId, step.id, step, token)
                const index = this.project.steps.findIndex(s => s.id === step.id)
            } catch (error) {
                console.error('Error updating step:', error)
                this.error = "Failed to update step. Please try again."
            }
        },
        async saveMaterial() {
            try{
                const token = localStorage.getItem('authToken')
                const projectId = this.project.id

                if(this.selectedMaterialId) {
                    await api.addExistingMaterialToProject(projectId, this.selectedMaterialId, token)
                } else if(this.newMaterialData.name) {
                    const response = await api.addNewMaterialToProject(projectId, this.newMaterialData, token)
                    this.project.materials.push(response.data)
                }
                this.isAddMaterialModalOpen = false
                this.newMaterialData = { name: '' }
                this.selectedMaterialId = null
            } catch (error) {
                console.error('Error adding material:', error)
                this.error = "Failed to add material. Please try again."
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

<style>
@import '../assets/styles/styles.css';

.max-w-md {
  background-color: #f5f5dc;
}

.v-list {
    background-color: #f5f5dc;
}

.headline {
    font-size: 28px;
    font-weight: bold;
    color: #4e4e33;
    margin-bottom: 20px;
}

.subheadline {
    font-size: 22px;
    font-weight: bold;
    color: #4e4e33;
    margin-top: 20px;
}

.v-btn {
    background-color: #9caf88;
    color: white;
    margin: 10px 0;
    border-radius: 5px;
}

.v-btn:hover {
    background-color: #7a9c6e;
}

.v-text-field,
.v-textarea,
.v-select,
.v-checkbox {
    margin-bottom: 20px;
}

.step-card, .material-card {
    background-color: #e4eedd;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.step-card:hover, .material-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.edit-btn,
.add-step-btn,
.add-material-btn,
.back-btn {
    background-color: #9caf88;
    color: white;
    margin: 10px 0;
    border-radius: 5px;
}

.delete-btn {
    background-color: #e57373;
    color: white;
}

.update-btn, .save-btn {
    background-color: #9caf88;
    color: white;
    margin-top: 20px;
    border-radius: 5px;
}
</style>