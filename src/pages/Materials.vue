<template>
    <div class="max-w-md m-auto py-10">
        <AppHeader/>
        <hr>
        <h1 class="headline">Your Materials Inventory</h1>
        <v-container>
        <v-simple-table>
            <thead>
            <tr>
                <th>Material</th>
                <th>Quantity</th>
            </tr>
            </thead>
            <body>
            <tr v-for="material in materials" :key="material.id">
                <td>{{ material.name }}</td>
                <td>
                <v-text-field v-model="material.quantity" type="number" min="0" @change="updateMaterial(material)" outlined dense></v-text-field>
                </td>
            </tr>
            </body>
        </v-simple-table>
        </v-container>
    </div>

</template>

<script>
import api from '@/services/api'
import AppHeader from '@/components/AppHeader.vue'

export default{
    data(){
        return{
            materials: []
        }
    },
    mounted(){
        this.fetchMaterials()
    },
    methods: {
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
        console.log('Updating material:', material)

        if (material.quantity === '0') {
          await this.deleteMaterial(material.id)
        } else {
          try {
            await api.updateMaterial(material.id, { quantity: material.quantity }, token)
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
</style>