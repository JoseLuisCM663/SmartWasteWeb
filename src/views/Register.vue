<template>
  <div class="register-wrapper">
    <div class="overlay"></div>
    <div class="register-container">
      <h1>Regístrate</h1>
      <div class="form-group">
        <label for="username">Nombre Completo*</label>
        <input type="text" id="username" v-model="username" placeholder="Ingresa tu Nombre" required>
      </div>
      <div class="form-group">
        <label for="email">Correo Electrónico*</label>
        <input type="email" id="email" v-model="email" placeholder="Ingresa tu Correo" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña*</label>
        <input type="password" id="password" v-model="password" placeholder="Ingresa tu Contraseña" required>
      </div>
      <div class="terms">
        <label>
          <input type="checkbox" v-model="acceptTerms"> Acepto los Términos, Condiciones y Políticas de SmartWaste
        </label>
      </div>
      <button type="submit" @click="register">Regístrate</button>
      <p class="login-link">¿Tienes una cuenta? <a href="/login">Inicia Sesión</a></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      phone: '',
      acceptTerms: false
    };
  },
  methods: {
    async register() {
      if (!this.acceptTerms) {
        alert('Debes aceptar los términos y condiciones.');
        return;
      }

      try {
        const payload = {
          Nombre_Usuario: this.username || null,
          Correo_Electronico: this.email || null,
          Numero_Telefonico_Movil: this.phone || null,
          Contrasena: this.password || null,
          Persona_ID: null,
          Estatus: "Activo"
        };

        const response = await axios.post('http://127.0.0.1:8000/api/usuarios/registro/', payload);

        alert('¡Registro exitoso!');
        console.log('Respuesta:', response.data);

        this.username = '';
        this.email = '';
        this.password = '';
        this.phone = '';
        this.acceptTerms = false;
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al registrar:', error.response?.data || error.message);
        alert('Error al registrar. Revisa los datos e intenta nuevamente.');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

.register-wrapper {
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

.register-container {
  position: relative;
  z-index: 2;
  max-width: 400px;
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

input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 10px;
  border: 1.5px solid #7ba3cc;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f0f2f5;
  color: #2d3a3f;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input::placeholder {
  color: #9da9b0;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.terms {
  margin: 14px 0;
}

.terms label {
  display: flex;
  align-items: center;
  color: #4f5e65;
  font-size: 13.5px;
  line-height: 1.4;
}

.terms input[type="checkbox"] {
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
  margin-top: 5px;
}

button:hover {
  background-color: #3b82f6;
}

.login-link {
  text-align: center;
  margin-top: 14px;
  color: #4f5e65;
  font-size: 14px;
}

.login-link a {
  color: #3b82f6;
  text-decoration: none;
  transition: text-decoration 0.3s;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
