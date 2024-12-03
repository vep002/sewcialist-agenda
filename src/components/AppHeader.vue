<template>
    <v-container>
        <button @click="handleLogout">Logout</button>
        <button @click="navigateToMaterials">My Materials</button>
        <button @click="navigateToProjects">My Projects</button>
    </v-container>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      userId: localStorage.getItem('currentUser'),
    }
  },
  mounted() {
    console.log('User ID: ', this.userId)
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
    navigateToMaterials() {
      if (this.$route.path.includes('materials')) {
        return
      } else {
        this.$router.replace(`/users/${this.userId}/materials`)
      }
    },
    navigateToProjects() {
      if (this.$route.path.includes('projects')) {
        return
      } else {
      this.$router.replace(`/users/${this.userId}/projects`)
      }
    },
  }
}
</script>

<style>

</style>
