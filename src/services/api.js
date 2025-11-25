// 1. CAMBIO: Quitamos "/api" porque el Gateway ya maneja las rutas desde la raíz
const API_URL = "http://localhost:8085";

// --- MICROSERVICIO DE USUARIOS ---
export const userService = {
  create: async (userData) => {
    // 2. CAMBIO: "/users" -> "/usuarios" (para coincidir con el Gateway)
    const response = await fetch(${API_URL}/usuarios, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Error al registrar usuario');
    return response.json();
  },

  login: async (email, password) => {
    // CAMBIO: "/usuarios/login"
    const response = await fetch(${API_URL}/usuarios/login, {
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
      // CAMBIO: "/usuarios"
      const response = await fetch(${API_URL}/usuarios);
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
      // CAMBIO: "/products" -> "/productos"
      const response = await fetch(${API_URL}/productos);
      if (!response.ok) throw new Error('Error cargando productos');
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      return [];
    }
  },

  create: async (productData) => {
    const response = await fetch(${API_URL}/productos, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  }
};

// --- MICROSERVICIO DE CARRITO ---
export const cartService = {
  getCart: async (userId) => {
    try {
      // CAMBIO: "/cart" -> "/carrito"
      const response = await fetch(${API_URL}/carrito/${userId});
      if (response.status === 404) return [];
      if (!response.ok) throw new Error('Error al obtener carrito');
      return await response.json();
    } catch (error) {
      console.error("Error en servicio de carrito:", error);
      return [];
    }
  },

  addToCart: async (userId, productId, cantidad) => {
    const response = await fetch(${API_URL}/carrito, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, cantidad })
    });
    if (!response.ok) throw new Error('No se pudo agregar al carrito');
    return response.json();
  },

  removeFromCart: async (userId, productId) => {
    await fetch(${API_URL}/carrito/${userId}/item/${productId}, {
      method: 'DELETE'
    });
  },

  clearCart: async (userId) => {
    await fetch(${API_URL}/carrito/${userId}, {
      method: 'DELETE'
    });
  }
};