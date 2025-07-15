<template>
  <div class="landing-container">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo">
        <img src="@/assets/Logo.jpeg" alt="SmartWaste Logo" />
        <span>SmartWaste</span>
      </div>
      <nav>
        <a href="#servicios">Servicios</a>
        <a href="#membresias">Membresías</a>
        <a href="#contacto">Contacto</a>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text">
        <h1>Gestión inteligente de residuos</h1>
        <p>Conectamos tecnología para un mundo más limpio</p>
        <button @click="goToRegister">Regístrate ahora</button>
      </div>
    </section>

    <!-- Servicios -->
    <section id="servicios" class="servicios">
      <h2>Nuestros Servicios</h2>
      <div class="cards">
        <div class="card">
          <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="Recolección" />
          <h3>Recolección Programada</h3>
        </div>
        <div class="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png" alt="Monitoreo" />
          <h3>Monitoreo IoT</h3>
        </div>
        <div class="card">
          <img src="https://cdn-icons-png.flaticon.com/512/943/943593.png" alt="Análisis" />
          <h3>Análisis de Datos</h3>
        </div>
        <div class="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2331/2331948.png" alt="Educación" />
          <h3>Educación Ambiental</h3>
        </div>
        <div class="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Soporte" />
          <h3>Soporte Personalizado</h3>
        </div>
      </div>
    </section>

    <!-- Membresías -->
    <section id="membresias" class="membresias">
      <h2>Membresías</h2>
      <ul>
        <li>💚 Mensual: $400 MXN</li>
        <li>🌿 Trimestral: $1,000 MXN</li>
        <li>🌎 Anual: $3,500 MXN</li>
      </ul>
    </section>

    <!-- Contacto -->
    <section id="contacto" class="contacto">
      <h2>Contáctanos</h2>
      <p>📍 Xicotepec de Juárez, Puebla</p>
      <p>📞 789-123-4567</p>
      <p>📧 contacto@smartwaste.mx</p>

      <form class="formulario-contacto">
        <div class="campo">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" required />
        </div>
        <div class="campo">
          <label for="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="campo">
          <label for="mensaje">Mensaje:</label>
          <textarea id="mensaje" name="mensaje" rows="4" required></textarea>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </section>

    <footer>
      <p>&copy; 2025 SmartWaste. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>


<script>
export default {
  name: "LandingPage",
  methods: {
    goToRegister() {
      window.location.href = "/registro";
    },
  },
};
</script>

<style scoped>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: "Poppins", sans-serif;
  background-color: #f7f7f5;
  color: #2d3a3f;
}

.landing-container {
  width: 100%;
  background-color: #f7f7f5;
  color: #2d3a3f;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #2d3a3f;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo img {
  height: 50px;
  border-radius: 50%;
}

.logo span {
  font-weight: bold;
  color: #ffffff;
  font-size: 1.2rem;
}

nav a {
  color: #ffffff;
  margin-left: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover {
  color: #4caf50;
}

/* Hero Section */
.hero {
  background-color: #e0e4e7;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.hero-text h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #2d3a3f;
}

.hero-text p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #4f5e65;
}

.hero-text button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.hero-text button:hover {
  background-color: #43a047;
}

/* Secciones */
.servicios,
.membresias,
.contacto {
  padding: 60px 20px;
  text-align: center;
  background-color: #ffffff;
}

.servicios h2,
.membresias h2,
.contacto h2 {
  font-size: 2rem;
  margin-bottom: 40px;
  color: #4caf50;
}

.cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  width: 200px;
  border: 1px solid #cdd1d4;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.card img {
  height: 60px;
  margin-bottom: 15px;
}

.card h3 {
  color: #2d3a3f;
}

/* Membresías */
.membresias ul {
  list-style: none;
  padding: 0;
  font-size: 1.2rem;
  line-height: 2.2rem;
  color: #4f5e65;
}

/* Contacto */
.contacto {
  padding: 40px 20px;
  background-color: #ffffff;
}

.contacto h2 {
  margin-bottom: 10px;
}

.contacto p {
  color: #4f5e65;
  margin: 5px 0;
}

.formulario-contacto {
  max-width: 600px;
  margin: 20px auto;
  text-align: left;
}

.campo {
  margin-bottom: 15px;
}

.campo label {
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
  color: #4f5e65;
}

.campo input,
.campo textarea {
  width: 100%;
  padding: 10px;
  border: 1.5px solid #7ba3cc;
  border-radius: 5px;
  background-color: #f0f2f5;
  color: #2d3a3f;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.campo input:focus,
.campo textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #43a047;
}

/* Footer */
footer {
  background-color: #2d3a3f;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
  color: #cccccc;
}

/* Media Queries para móviles */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
  }

  nav a {
    display: block;
    margin: 10px 0;
  }

  .cards {
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 90%;
  }

  .hero-text h1 {
    font-size: 2rem;
  }

  .hero-text p {
    font-size: 1rem;
  }

  .hero {
    min-height: auto;
    padding: 60px 20px;
  }
}
</style>
