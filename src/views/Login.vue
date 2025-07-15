<template>
  <div class="login-wrapper">
    <div class="overlay"></div>
    <div class="login-container">
      <h1>Inicia Sesión</h1>
      <div class="form-group">
        <label for="email">Correo Electrónico*</label>
        <input type="email" id="email" v-model="email" placeholder="correo@ejemplo.com" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña*</label>
        <input type="password" id="password" v-model="password" placeholder="********" required>
      </div>
      <div class="options">
        <label>
          <input type="checkbox" v-model="rememberPassword"> Recordar contraseña
        </label>
      </div>
      <button @click="login">Iniciar Sesión</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      rememberPassword: false
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/usuarios/login', {
          Correo_Electronico: this.email,
          Contrasena: this.password
        });

        const token = response.data.access_token;

        // Guarda el token en localStorage o sessionStorage
        if (this.rememberPassword) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        alert('¡Inicio de sesión exitoso!');
        console.log('Token recibido:', token);

        // Redirigir al dashboard
        this.$router.push('/dashboard');

      } catch (error) {
        console.error('Error al iniciar sesión:', error.response?.data || error.message);
        alert('Credenciales inválidas. Intenta nuevamente.');
      }
    }
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

.login-wrapper {
  font-family: 'Rubik', sans-serif;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f5;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.login-container {
  position: relative;
  z-index: 2;
  max-width: 350px;
  width: 90%;
  padding: 35px 25px;
  border: 1px solid #3b82f6;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #2d3a3f;
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #4f5e65;
  font-weight: 500;
  font-size: 14px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1.5px solid #7ba3cc;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f0f2f5;
  color: #2d3a3f;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: #9da9b0;
}

input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.options {
  margin-bottom: 18px;
}

.options label {
  display: flex;
  align-items: center;
  color: #4f5e65;
  font-size: 13.5px;
}

.options input[type="checkbox"] {
  margin-right: 8px;
  accent-color: #4caf50;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3b82f6;
}
</style>
