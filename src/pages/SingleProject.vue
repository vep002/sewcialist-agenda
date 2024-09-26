<template>
    <div>
        <button @click="backToProjectList">Back to Project List</button>
        <h1>{{  project.title  }}</h1>
        <button @click="openEditProjectModal">Edit</button>
        <p>{{ project.description }}</p>
        <p>{{ project.status }}</p>

        <h2>Steps</h2>
        <ol>
            <li v-for="step in project.steps" :key="step.id">
                <form @submit.prevent="updateStep(step)">
                    <label>
                        Description:
                        <input v-model="step.description" type="text" required/>
                    </label>
                    <label>
                        Start Date:
                        <input v-model="step.start_date" type="date" />
                    </label>
                    <label>
                        End Date:
                        <input v-model="step.end_date" type="date" />
                    </label>
                    <label>
                        Completed:
                        <input type="checkbox" v-model="step.completed" /> 
                    </label>
                    <button type="submit">Update Step</button>
                </form>
                <button @click="deleteStep(project.id, step.id)">Delete</button>
            </li>
        </ol>
        <button @click="openAddStepModal(null)">Add Step</button>

        <h2>Materials</h2>
        <ul>
            <li v-for="material in project.materials" :key="material.id">
                <div>
                    <p>{{ material.name }}</p>
                </div>
            </li>
        </ul>
        <button @click="openEditMaterialModal(null)">Edit Materials</button>

        <Modal :isModalOpen="isEditProjectModalOpen" @close="closeModals">
            <form @submit.prevent="saveProject">
            <h1>Edit Project</h1>
                <div>
                    <label for="title">Project Title:</label>
                    <input id="title" v-model="project.title" type="text" required>
                </div>
                <div>
                    <label for="description">Project Description:</label>
                    <textarea id="description" v-model="project.description" required></textarea>
                </div>
                <div>
                    <label for="status">Project Status:</label>
                    <select id="status" v-model="project.status" required>
                        <option value="0">Not Started</option>
                        <option value="1">In Progress</option>
                        <option value="2">Completed</option>
                    </select>
                </div>
                <button type="submit">Save</button>
            </form>
        </Modal>

        <Modal :isModalOpen="isAddStepModalOpen" @close="closeModals">
            <form @submit.prevent="addStep(newStepData)">
                <!-- Step Edit Form -->
                 <label>
                    Description:
                    <input v-model="newStepData.description" type="text" required/> 
                 </label>
                 <label>
                    Start Date:
                    <input v-model="newStepData.start_date" type="date" /> 
                 </label>
                 <label>
                    End Date:
                    <input v-model="newStepData.end_date" type="date" />
                 </label>
                <label>
                    Completed:
                    <input type="checkbox" v-model="newStepData.completed" /> 
                </label>
                <button type="submit">Save</button>
            </form>
        </Modal>

        <Modal :isModalOpen="isEditMaterialModalOpen" @close="closeModals">
            <form @submit.prevent="saveMaterial">
                <!-- Material Edit Form -->
                <input v-model="editingMaterial.name" type="text" required />
                <button type="submit">Save</button>
                <button @click="deleteMaterial(editingMaterial.id)" v-if="editingMaterial.id">Delete</button>
            </form>
        </Modal> 
    </div>
</template>

<script>
import api from '@/services/api'

export default {
    data() {
        return {
            userId: '',
            isEditProjectMopen: false,
            isAddStepModalOpen: false,
            isEditMaterialModalOpen: false,
            editingStep: null,
            editingMaterial: null,
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
            error: null
        }
    },
    async created() {
        // Fetch project for the user using the projectId prop
        await this.fetchProject()
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
                this.userId = response.data.user_id
                console.log('UserId:', this.userId)
            } catch (error) {
                this.error = 'Error fetching project: ' + error.response.data.message
                console.error('Error fetching project:', error)
            }
        },
        openEditProjectModal() {
            this.isEditProjectModalOpen = true
        },
        openAddStepModal(step) {
            this.addingStep = step || { description: '', start_date: '', end_date: '', completed: false }
            this.isAddStepModalOpen = true
        },
        openEditMaterialModal(material) {
            this.editingMaterial = material || { name: '' }
            this.isEditMaterialModalOpen = true
        },
        closeModals() {
            this.isEditProjectModalOpen = false
            this.isEditStepModalOpen = false
            this.isEditMaterialModalOpen = false
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
        saveMaterial() {},
        // async updateProject() {
        //     try {
        //         const token = localStorage.getItem('authToken')
        //         const projectId = this.$route.params.projectId
        //         const response = await api.updateProject(projectId, this.project, token)
        //         this.project = response.data
        //     } catch (error) {
        //         this.error = 'Error updating project: ' + error.response.data.message
        //         console.error('Error updating project:', error)
        //     }
        // },
    }
}
</script>