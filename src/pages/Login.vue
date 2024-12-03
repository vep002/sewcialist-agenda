<template>
    <v-container class="splash-container" fluid>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="pa-4 form-card">
            <v-row>
              <v-col cols="10">
                <h1 class="headline">The Sewcialist Agenda</h1>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <h2>Login</h2>
                <v-alert 
                  v-model="showError" 
                  type="error" 
                  class="mb-4"
                >
                  {{ errorMessage }}
                </v-alert>
                <v-form @submit.prevent="handleSubmit">
                  <v-text-field v-model="email" label="Email" required class="input-field"></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password" required class="input-field"></v-text-field>
                  <v-btn class="mt-4 signup-btn" block type="submit">Login</v-btn>
                </v-form>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import api from '@/services/api'
  import logo from '@/assets/logo.png'
  
  export default {
    name: 'LoginPage',
    data() {
      return {
        userId: '',
        email: '',
        password: '',
        logo,
        showError: false,
        errorMessage: '',
      }
    },
    methods: {
      async handleSubmit() {
        this.showError = false;
        this.errorMessage = '';

        if (!this.email || !this.password) {
          this.errorMessage = 'Please enter a valid email and password';
          this.showError = true;
          return;
        }

        try {
          const user = {
            email: this.email,
            password: this.password,
          }
          const response = await api.login(user)
          this.userId = response.data.status.data.user.id
          const token = response.headers.authorization.split(' ')[1]
          localStorage.setItem('authToken', token)
          localStorage.setItem('currentUser', this.userId)
          this.$router.replace(`users/${this.userId}/projects`)
        } catch (error) {
          this.errorMessage = 'Please enter a valid email and password';
          this.showError = true;
          console.error('Error signing in user: ', error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  @import '@/assets/styles/styles.css';
  </style>