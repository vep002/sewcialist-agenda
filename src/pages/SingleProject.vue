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
                <p>{{ step.description }}</p>
                <p>{{ step.start_date }}</p>
                <p>{{ step.end_date }}</p>
                <p>{{ step.completed }}</p>
                <button @click="deleteStep(project.id, step.id)">Delete</button>
            </li>
        </ol>
        <button @click="openEditStepModal(null)">Edit Steps</button>

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

        <Modal :isModalOpen="isEditStepModalOpen" @close="closeModals">
            <form @submit.prevent="saveStep">
                <!-- Step Edit Form -->
                 <label>
                    <input v-model="editingStep.description" type="text" required/> Description
                 </label>
                 <label>
                    <input v-model="editingStep.start_date" type="date" /> Start Date
                 </label>
                 <label>
                    <input v-model="editingStep.end_date" type="date" /> End Date
                 </label>
                <label>
                    <input type="checkbox" v-model="editingStep.completed" /> Completed
                </label>
                <button type="submit">Save</button>
                <button @click="deleteStep(editingStep.id)" v-if="editingStep.id">Delete</button>
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
            isEditStepModalOpen: false,
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
        openEditStepModal(step) {
            this.editingStep = step || { description: '', start_date: '', end_date: '', completed: false }
            this.isEditStepModalOpen = true
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
        saveStep() {},
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