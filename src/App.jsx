import React, { useState, useEffect } from 'react';
import { ShoppingCart, Home, Info, Store, Trash2, Plus, Minus, User, LogOut, Receipt } from 'lucide-react';
import { userService, productService, cartService } from './services/api';

// ==========================================
// VISTAS (SCREENS)
// ==========================================

const LoginScreen = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await onLogin(email, password); } catch (err) { setError("Error al iniciar sesión"); }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
            <Store size={40} className="text-primary" />
          </div>
          <h2 className="fw-bold text-dark">Pastelería Mil Sabores</h2>
          <p className="text-muted">Ingresa a tu cuenta</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="floatingInput">Correo Electrónico</label>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label htmlFor="floatingPassword">Contraseña</label>
          </div>
          
          {error && <div className="alert alert-danger py-2 text-center small">{error}</div>}
          
          <button type="submit" className="btn btn-primary w-100 btn-lg py-3 fw-bold shadow-sm">INGRESAR</button>
        </form>
        
        <div className="text-center mt-4">
          <p className="mb-0 text-muted">¿No tienes una cuenta?</p>
          <button onClick={onNavigateToRegister} className="btn btn-link text-decoration-none fw-bold">Regístrate aquí</button>
        </div>
      </div>
    </div>
  );
};

const RegisterScreen = ({ onRegister, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '', nombre: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await onRegister(formData); } catch (err) { alert("Error al registrarse"); }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Crear Cuenta</h2>
          <p className="text-muted">Únete a nosotros</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" placeholder="Nombre" onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
            <label>Nombre Completo</label>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <label>Correo Electrónico</label>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <label>Contraseña</label>
          </div>
          <button type="submit" className="btn btn-success w-100 btn-lg py-3 fw-bold shadow-sm">REGISTRARSE</button>
        </form>
        
        <div className="text-center mt-4">
          <button onClick={onNavigateToLogin} className="btn btn-link text-decoration-none">Volver al Inicio de Sesión</button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ onChangeRoute }) => (
  <div className="text-center py-5">
    <div className="p-5 mb-4 bg-white rounded-3 shadow-sm border">
      <Store size={64} className="text-primary mb-4" />
      <h1 className="display-5 fw-bold text-dark">Bienvenido a la Pastelería</h1>
      <p className="col-md-8 fs-4 mx-auto text-muted mb-4">
        Los mejores pasteles artesanales, ahora con la comodidad de pedir desde tu casa.
      </p>
      <button onClick={() => onChangeRoute('catalogo')} className="btn btn-primary btn-lg px-5 shadow-sm">
        Ver Catálogo
      </button>
    </div>
  </div>
);

const CatalogScreen = ({ products, onAddToCart }) => {
  if (!products.length) return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p className="mt-2">Cargando productos...</p></div>;
  
  return (
    <div className="py-4">
      <h2 className="text-center mb-4 fw-bold text-dark">Nuestros Productos</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
        {products.map(p => <ProductCard key={p.id} producto={p} onAddToCart={onAddToCart} />)}
      </div>
    </div>
  );
};

const ProductCard = ({ producto, onAddToCart }) => {
  const [cantidad, setCantidad] = useState(1);
  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0 product-card-hover">
        <div style={{ height: '220px', overflow: 'hidden', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem' }}>
          <img 
            src={producto.imagenUrl || "https://placehold.co/400x300/f8f9fa/adb5bd?text=Pastel"} 
            className="w-100 h-100" 
            style={{ objectFit: 'cover' }} 
            alt={producto.nombre} 
          />
        </div>
        <div className="card-body d-flex flex-column p-4">
          <h5 className="card-title fw-bold mb-1">{producto.nombre}</h5>
          <p className="card-text text-primary fw-bold fs-5 mb-3">${Number(producto.precio).toLocaleString()}</p>
          
          <div className="mt-auto d-flex gap-2">
            <div className="input-group" style={{ width: '110px' }}>
              <button className="btn btn-outline-secondary px-2" onClick={() => setCantidad(c => Math.max(1, c - 1))}><Minus size={14} /></button>
              <span className="form-control text-center px-0 fw-bold bg-light">{cantidad}</span>
              <button className="btn btn-outline-secondary px-2" onClick={() => setCantidad(c => c + 1)}><Plus size={14} /></button>
            </div>
            <button className="btn btn-primary flex-fill fw-bold shadow-sm" onClick={() => { onAddToCart(producto, cantidad); setCantidad(1); }}>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartScreen = ({ cart, onRemove, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + ((item.producto?.precio || 0) * item.cantidad), 0);

  if (!cart.length) return (
    <div className="text-center py-5">
      <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
        <ShoppingCart size={48} className="text-muted" />
      </div>
      <h3 className="text-muted">Tu carrito está vacío</h3>
    </div>
  );

  return (
    <div className="py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-4 fw-bold d-flex align-items-center gap-2">
            <span className="badge bg-primary rounded-pill">{cart.length}</span> Productos en Carrito
          </h2>
          <div className="card shadow-sm border-0 mb-4 overflow-hidden">
            <ul className="list-group list-group-flush">
              {cart.map((item, idx) => (
                <li key={idx} className="list-group-item p-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light rounded p-2 text-center" style={{width:'60px'}}>
                      <span className="fw-bold fs-5">{item.cantidad}x</span>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">{item.producto?.nombre}</h5>
                      <small className="text-muted">Unitario: ${Number(item.producto?.precio).toLocaleString()}</small>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold fs-5 text-primary mb-1">
                      ${((item.producto?.precio || 0) * item.cantidad).toLocaleString()}
                    </div>
                    <button onClick={() => onRemove(item)} className="btn btn-link text-danger p-0 text-decoration-none text-sm">
                      <Trash2 size={16} className="me-1"/> Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow border-0 bg-primary text-white sticky-top" style={{ top: '100px' }}>
            <div className="card-body p-4">
              <h4 className="card-title mb-4 fw-bold">Resumen</h4>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-white border-opacity-25">
                <span className="fs-5">Total a Pagar</span>
                <span className="fs-2 fw-bold">${total.toLocaleString()}</span>
              </div>
              <button onClick={onCheckout} className="btn btn-light w-100 py-3 fw-bold text-primary shadow-sm">
                CONFIRMAR COMPRA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceScreen = ({ total, onFinalize }) => (
  <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="card text-center shadow-lg border-0 p-5" style={{ maxWidth: '500px', width: '100%', borderRadius: '20px' }}>
      <div className="mb-4">
        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4">
          <Receipt size={64} className="text-success" />
        </div>
      </div>
      <h2 className="fw-bold mb-2">¡Gracias por tu compra!</h2>
      <p className="text-muted mb-4">Hemos procesado tu pedido exitosamente.</p>
      
      <div className="bg-light p-4 rounded-3 mb-4 border border-dashed">
        <p className="mb-1 text-uppercase text-muted small fw-bold">Total Pagado</p>
        <h1 className="text-success fw-bold m-0">${total.toLocaleString()}</h1>
      </div>
      
      <button onClick={onFinalize} className="btn btn-dark w-100 py-3 fw-bold">
        Volver a la Tienda
      </button>
    </div>
  </div>
);

const ContactScreen = () => (
  <div className="py-5 text-center">
    <h2 className="fw-bold mb-5">Nuestras Sucursales</h2>
    <div className="row justify-content-center g-4">
      <div className="col-md-5 col-lg-4">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body p-5">
            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <Store size={32} className="text-primary" />
            </div>
            <h4 className="fw-bold">Central</h4>
            <p className="text-muted mb-0">Av. Principal 123, Ciudad</p>
            <p className="text-primary fw-bold">+56 2 2222 2222</p>
          </div>
        </div>
      </div>
      <div className="col-md-5 col-lg-4">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body p-5">
            <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <Store size={32} className="text-info" />
            </div>
            <h4 className="fw-bold">Norte</h4>
            <p className="text-muted mb-0">Calle Secundaria 456, Ciudad</p>
            <p className="text-info fw-bold">+56 2 3333 3333</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// APP PRINCIPAL
// ==========================================

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [currentRoute, setCurrentRoute] = useState("login");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); 

  useEffect(() => {
    if (currentUser) {
      productService.getAll().then(setProducts).catch(() => setProducts([]));
      cartService.getCart(currentUser.id).then(setCart).catch(() => setCart([]));
    }
  }, [currentUser]);

  const handleLogin = async (e, p) => { const u = await userService.login(e, p); setCurrentUser(u); setCurrentRoute("home"); };
  const handleRegister = async (d) => { await userService.create(d); setCurrentRoute("login"); };
  const handleAddToCart = async (p, c) => { await cartService.addToCart(currentUser.id, p.id, c); cartService.getCart(currentUser.id).then(setCart); };
  const handleRemove = async (i) => { 
    const pid = i.producto?.id || i.productId;
    await cartService.removeFromCart(currentUser.id, pid);
    setCart(prev => prev.filter(x => (x.producto?.id || x.productId) !== pid));
  };
  const handleCheckout = async () => { await cartService.clearCart(currentUser.id); setCurrentRoute("boleta"); };

  // Si no hay usuario, pantalla completa centrada
  if (!currentUser) {
    return (
      <div className="bg-light min-vh-100">
        {currentRoute === "register" 
          ? <RegisterScreen onRegister={handleRegister} onNavigateToLogin={() => setCurrentRoute("login")} />
          : <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setCurrentRoute("register")} />
        }
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + ((item.producto?.precio || 0) * item.cantidad), 0);

  // App Layout estilo Web (Navbar arriba)
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar estilo Web */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sticky-top py-3">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#" onClick={(e) => {e.preventDefault(); setCurrentRoute("home")}}>
            <Store /> PASTELERÍA
          </a>
          
          <div className="d-flex align-items-center gap-3 order-lg-3">
             <span className="text-white-50 d-none d-md-block">Hola, {currentUser.nombre || currentUser.email}</span>
             <button onClick={() => {setCurrentUser(null); setCart([]); setCurrentRoute("login");}} className="btn btn-outline-light btn-sm">
               <LogOut size={18} />
             </button>
          </div>

          <div className="collapse navbar-collapse justify-content-center order-lg-2 d-flex w-auto">
            <ul className="navbar-nav mb-2 mb-lg-0 gap-3">
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentRoute === 'home' ? 'active fw-bold' : ''}`} onClick={() => setCurrentRoute("home")}>Inicio</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentRoute === 'catalogo' ? 'active fw-bold' : ''}`} onClick={() => setCurrentRoute("catalogo")}>Catálogo</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentRoute === 'contacto' ? 'active fw-bold' : ''}`} onClick={() => setCurrentRoute("contacto")}>Contacto</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link position-relative ${currentRoute === 'carrito' ? 'active fw-bold' : ''}`} onClick={() => setCurrentRoute("carrito")}>
                  Carrito
                  {cart.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{cart.length}</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenido Principal Centrado */}
      <main className="flex-grow-1 py-4">
        <div className="container">
          {currentRoute === "home" && <HomeScreen onChangeRoute={setCurrentRoute} />}
          {currentRoute === "catalogo" && <CatalogScreen products={products} onAddToCart={handleAddToCart} />}
          {currentRoute === "carrito" && <CartScreen cart={cart} onRemove={handleRemove} onCheckout={handleCheckout} />}
          {currentRoute === "contacto" && <ContactScreen />}
          {currentRoute === "boleta" && <InvoiceScreen total={total} onFinalize={() => {setCart([]); setCurrentRoute("home");}} />}
        </div>
      </main>

      <footer className="bg-white text-center py-4 text-muted mt-auto border-top">
        <small>&copy; 2025 Pastelería Web. Todos los derechos reservados.</small>
      </footer>
    </div>
  );
}