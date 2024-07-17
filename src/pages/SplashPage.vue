<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="pa-4">
            <v-row>
              <v-col cols="2">
                <v-img :src="logo" alt="logo" class="logo"></v-img>
              </v-col>
              <v-col cols="10">
                <h1 class="headline">The Sewcialist Agenda</h1>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <h2>Create an Account</h2>
                <p>Already registered? <router-link to="/login">Login</router-link></p>
                <v-form @submit.prevent="handleSubmit">
                  <v-text-field v-model="name" label="Username" required></v-text-field>
                  <v-text-field v-model="email" label="Email" required></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                  <v-btn class="mt-4" color="primary" block @click="handleSubmit">Sign Up</v-btn>
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
      }
    },
    methods: {
      async handleSubmit() {
        try {
          const user = {
            name: this.name,
            email: this.email,
            password: this.password,
          }
          const response = await api.register(user)
          console.log('User registered: ', response.data)
          this.$router.replace('users/${userId}/projects')
        } catch (error) {
          console.error('Error registering user: ', error)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .logo {
    width: 50px;
    height: 50px;
  }
  .headline {
    font-size: 24px;
    font-weight: bold;
  }
  </style>