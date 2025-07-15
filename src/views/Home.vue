<template>
  <div class="home-wrapper">
<header class="home-header">
  <div class="left">
    <img src="@/assets/Logo.jpeg" alt="SmartWaste Logo" class="logo" />
    <h1>Monitoreo en Tiempo Real</h1>
  </div>
  <nav>
    <router-link to="/login" class="logout-link">Salir</router-link>
  </nav>
</header>



    <div class="monitor-container">
      <div class="bin-background">
        <div class="bin-level" :class="{ active: level >= 1 }"></div>
        <div class="bin-level" :class="{ active: level >= 2 }"></div>
        <div class="bin-level" :class="{ active: level >= 3 }"></div>
        <div class="bin-level" :class="{ active: level >= 4 }"></div>
        <img src="@/assets/bote.png" alt="Bote de Basura" class="bin-image" />
      </div>

      <div class="status">
        <p>Nivel Actual: {{ level }}/4 ({{ percentage }}%)</p>
        <p :class="{'alert': level === 4}">{{ level === 4 ? '¡Vaciar ahora!' : 'Estado normal' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      level: 2 // Simulado, luego conectarás el websocket para actualizar esto en tiempo real
    };
  },
  computed: {
    percentage() {
      return this.level * 25;
    }
  },
  mounted() {
    // Aquí va tu código para conectar al websocket 
  }
};
</script>

<style scoped>
.home-wrapper {
  font-family: 'Poppins', sans-serif;
  background-color: #f7f7f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: #2d3a3f;
  width: 100%;
  color: #ffffff;
}

.home-header .left {
  display: flex;
  align-items: center;
  gap: 15px;
}


.home-header .logo {
  height: 40px;
  border-radius: 50%;
}

.monitor-container {
  margin-top: 40px;
  text-align: center;
}

.bin-background {
  position: relative;
  width: 200px;
  height: 400px;
  margin: 0 auto;
  border: 2px solid #cdd1d4;
  border-radius: 10px;
  overflow: hidden;
  background-color: transparent;
}


.bin-level {
  position: absolute;
  width: 100%;
  height: 25%;
  bottom: 0;
  background-color: #e0e0e0;
  opacity: 0.3;
  border-top: 1px solid #cdd1d4;
  transition: opacity 0.5s, background-color 0.5s;
  z-index: 1;

}

.bin-level.active {
  opacity: 1;
  background-color: #4caf50;
}

.bin-level:nth-child(2).active {
  background-color: #cddc39;
}

.bin-level:nth-child(3).active {
  background-color: #ff9800;
}

.bin-level:nth-child(4).active {
  background-color: #f44336;
}

.bin-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.5;            /* antes 0.2 */
  pointer-events: none;
  z-index: 0;
}



.status {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #4f5e65;
}

.status .alert {
  color: #f44336;
  font-weight: bold;
}
.logout-link {
  color: #ffffff;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #ffffff;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  
}

.logout-link:hover {
  background-color: #4caf50;
  color: #ffffff;
}

</style>
