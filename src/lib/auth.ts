"use client"

import { localStorageUtil } from './localStorage'
import { dbUtils } from './indexedDB'

export async function getUser() {
  const token = localStorageUtil.get<string>('access_token');
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

    // Cache user data in IndexedDB
    await dbUtils.saveUser(mappedUser);

    return mappedUser;
  } catch (error) {
    console.error('Error fetching user:', error);
    // Try to get from cache
    const cachedUsers = await dbUtils.getAllUsers();
    const cachedUser = cachedUsers.find(u => u.id === 1); // Assuming single user for now
    return cachedUser || null;
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

export function setToken(token: string) {
  localStorageUtil.set('access_token', token);
}

export function getToken(): string | null {
  return localStorageUtil.get<string>('access_token');
}

export function removeToken() {
  localStorageUtil.remove('access_token');
}