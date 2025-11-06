"use client"

export async function getUser() {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const response = await fetch('http://localhost:8000/api/usuarios/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    console.log('Datos crudos del servidor:', data);

    // Mapear la respuesta del backend
    const mappedUser = {
      id: data.ID,
      email: data.Correo_Electronico,
      name: data.Nombre_Usuario,
      role: mapRole(data.Tipo_Usuario)
    };

    console.log('Usuario mapeado:', mappedUser);
    return mappedUser;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Función auxiliar para mapear roles
function mapRole(backendRole: string): string {
  const role = backendRole?.toLowerCase() ?? '';
  
  if (role.includes('admin')) return 'ADMIN';
  if (role.includes('chofer')) return 'CHOFER';
  if (role.includes('usuario')) return 'USUARIO';
  
  return 'USUARIO'; // rol por defecto
}