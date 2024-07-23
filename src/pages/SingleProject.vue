<template>
    <div>
        <h1>Edit Project</h1>
        <form @submit.prevent="updateProject">
            <div>
                <label for="title">Project Title:</label>
                <input id="title" v-mmodel="project.title" type="text" required>
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
        <p>{{ project.description }}</p>
        <p>{{ project.status }}</p>

        <h2>Steps</h2>
        <ol>
        <li v-for="step in project.steps" :key="step.id">
            <p>{{ step.description }}</p>
            <p>{{ step.start_date }}</p>
            <p>{{ step.end_date }}</p>
            <p>{{ step.completed }}</p>
            <button @click="editStep(step.id)">Edit Step</button>
            <button @click="deleteStep(step.id)">Delete Step</button>
        </li>
        </ol>
        <button @click="addStep">Add Step</button>
        <h2>Materials</h2>
        <ul>
            <li v-for="material in project.materials" :key="material.id">
                <div>
                    <p>{{ material.name }}</p>
                    <button @click="editMaterial(material.id)">Edit Material</button>
                    <button @click="deleteMaterial(material.id)">Delete Material</button>
            </li>
        </ul>
        <button @click="addMaterial">Add Material</button>
    </div>
</template>

<script>
import api from '@/services/api'

export default {
    data() {
        return {
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
        async fetchProject() {
            try {
                const token = localStorage.getItem('authToken')
                const projectId = this.$route.params.projectId
                const response = await api.getProject(projectId, token)
                this.project = response.data
            } catch (error) {
                this.error = 'Error fetching project: ' + error.response.data.message
                console.error('Error fetching project:', error)
            }
        },
        async updateProject() {
            try {
                const token = localStorage.getItem('authToken')
                const projectId = this.$route.params.projectId
                const response = await api.updateProject(projectId, this.project, token)
                this.project = response.data
            } catch (error) {
                this.error = 'Error updating project: ' + error.response.data.message
                console.error('Error updating project:', error)
            }
        },
        editStep(stepId) {
            this.$router.push({ name: 'EditStep', params: { stepId } })
        },
        deleteStep(stepId) {
            // Implement delete step functionality
        },
        addStep() {
            this.$router.push({ name: 'AddStep', params: { projectId: this.project.id } })
        },
        editMaterial(materialId) {
            this.$router.push({ name: 'EditMaterial', params: { materialId } })
        },
        deleteMaterial(materialId) {
            // Implement delete material functionality
        },
        addMaterial() {
            this.$router.push({ name: 'AddMaterial', params: { projectId: this.project.id } })
        }
    }
}
</script>