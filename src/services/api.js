// Configuración: URL de tu API Gateway
const API_URL = "http://localhost:8080/api";

// --- MICROSERVICIO DE USUARIOS ---
export const userService = {
  create: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Error al registrar usuario');
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Credenciales incorrectas');
    }
    
    return response.json();
  },

  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error("Error conectando con servicio de usuarios", error);
      return [];
    }
  }
};

// --- MICROSERVICIO DE PRODUCTOS ---
export const productService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Error cargando productos');
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      return [];
    }
  },

  create: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  }
};

// --- MICROSERVICIO DE CARRITO ---
// ¡IMPORTANTE!: Asegúrate de que esta línea diga "export const"
export const cartService = {
  getCart: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${userId}`);
      if (response.status === 404) return [];
      if (!response.ok) throw new Error('Error al obtener carrito');
      return await response.json();
    } catch (error) {
      console.error("Error en servicio de carrito:", error);
      return [];
    }
  },

  addToCart: async (userId, productId, cantidad) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, cantidad })
    });
    if (!response.ok) throw new Error('No se pudo agregar al carrito');
    return response.json();
  },

  removeFromCart: async (userId, productId) => {
    await fetch(`${API_URL}/cart/${userId}/item/${productId}`, {
      method: 'DELETE'
    });
  },

  clearCart: async (userId) => {
    await fetch(`${API_URL}/cart/${userId}`, {
      method: 'DELETE'
    });
  }
};