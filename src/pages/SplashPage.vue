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
                <h2>Create an Account</h2>
                <p>Already registered? <router-link to="/login">Login</router-link></p>
                <v-alert 
                  v-model="showError" 
                  type="error" 
                  class="mb-4"
                >
                  {{ errorMessage }}
                </v-alert>
                <v-form @submit.prevent="handleSubmit">
                  <v-text-field v-model="name" label="Username" required class="input-field"></v-text-field>
                  <v-text-field v-model="email" label="Email" required class="input-field"></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password" required class="input-field"></v-text-field>
                  <v-btn class="mt-4 signup-btn" block type="submit">Sign Up</v-btn>
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
    name: 'SplashPage',
    data() {
      return {
        name: '',
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

        if (!this.name || !this.email || !this.password) {
          console.log('there is no name, email, or password');
          this.errorMessage = 'Please enter valid account information';
          this.showError = true;
          return;
        }

        try {
          const user = {
            name: this.name,
            email: this.email,
            password: this.password,
          }
          const userExists = await api.checkUserExists({name: this.name, email: this.email})
          if (userExists.data.exists) {
            console.log('user already exists');
            this.errorMessage = 'User already exists';
            this.showError = true;
            return;
          }
          const response = await api.register(user)
          this.$router.replace('users/${userId}/projects')
        } catch (error) {
          this.errorMessage = 'Please enter valid account information';
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