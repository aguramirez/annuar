// src/apps/website/pages/CandyStore.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../common/context/ThemeContext';
import { Link } from 'react-router-dom';

// Mock data for candy products
const candyProducts = [
  {
    id: '1',
    name: 'Combo Familiar',
    description: 'Popcorn grande + 4 Gaseosas medianas + 2 Chocolates',
    price: 2000,
    imageUrl: 'https://i.pinimg.com/736x/36/96/05/369605adcd515e808b8d950bb1997b8c.jpg',
    category: 'combos',
    discount: 20,
    popular: true
  },
  {
    id: '2',
    name: 'Combo Pareja',
    description: 'Popcorn grande + 2 Gaseosas medianas',
    price: 1400,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BNDRjY2E0ZmEtN2QwNi00NTEwLWI3MWItODNkMGYwYWFjNGE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    category: 'combos',
    discount: 15,
    popular: true
  },
  {
    id: '3',
    name: 'Popcorn Grande',
    description: 'Popcorn recién hecho en balde grande',
    price: 800,
    imageUrl: 'https://lumiere-a.akamaihd.net/v1/images/image003_f1e9732d.jpeg?region=0,0,662,827',
    category: 'popcorn',
    popular: true
  },
  {
    id: '4',
    name: 'Popcorn Mediano',
    description: 'Popcorn recién hecho en balde mediano',
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1568111561564-08726a1563e1?q=80&w=300&h=450&fit=crop&auto=format',
    category: 'popcorn'
  },
  {
    id: '5',
    name: 'Nachos con Queso',
    description: 'Crujientes nachos con salsa de queso',
    price: 700,
    imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=300&h=450&fit=crop&auto=format',
    category: 'snacks',
    popular: true
  },
  {
    id: '6',
    name: 'Gaseosa Grande',
    description: 'Coca-Cola, Sprite o Fanta (selecciona al retirar)',
    price: 400,
    imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&h=450&fit=crop&auto=format',
    category: 'drinks'
  },
  {
    id: '7',
    name: 'Gaseosa Mediana',
    description: 'Coca-Cola, Sprite o Fanta (selecciona al retirar)',
    price: 300,
    imageUrl: 'https://via.placeholder.com/300x450?text=Gaseosa+Mediana',
    category: 'drinks'
  },
  {
    id: '8',
    name: 'Agua Mineral',
    description: 'Botella de agua mineral 500ml',
    price: 200,
    imageUrl: 'https://via.placeholder.com/300x450?text=Agua+Mineral',
    category: 'drinks'
  },
  {
    id: '9',
    name: 'Chocolate',
    description: 'Barra de chocolate con leche',
    price: 250,
    imageUrl: 'https://via.placeholder.com/300x450?text=Chocolate',
    category: 'sweets'
  }
];

// Mock categories
const categories = [
  { id: 'all', name: 'Todos', iconClass: 'bi-grid' },
  { id: 'combos', name: 'Combos', iconClass: 'bi-box' },
  { id: 'popcorn', name: 'Popcorn', iconClass: 'bi-cup-hot' },
  { id: 'drinks', name: 'Bebidas', iconClass: 'bi-cup-straw' },
  { id: 'snacks', name: 'Snacks', iconClass: 'bi-egg-fried' },
  { id: 'sweets', name: 'Dulces', iconClass: 'bi-palette2' }
];

// Mock user data (normally would come from context)
const mockUser = {
  isAuthenticated: true,
  isPremium: false,
  name: 'Usuario de Prueba'
};

interface CartItem {
  product: any;
  quantity: number;
}

const CandyStore: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for the component
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  // Check if we're coming from ticket selection
  const fromTicketSelection = location.state?.fromTicketSelection || false;
  const reservationId = location.state?.reservationId || 'mock-reservation-123';
  
  // Calculate total items and price in cart
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? candyProducts 
    : candyProducts.filter(product => product.category === selectedCategory);
  
  // Add to cart function
  const addToCart = (product: any) => {
    setCart(prevCart => {
      // Check if product already in cart
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Increment quantity if already in cart
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    
    // Show success message
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 2000);
  };
  
  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  // Check if product is in cart
  const isInCart = (productId: string): boolean => {
    return cart.some(item => item.product.id === productId);
  };
  
  // Get quantity of item in cart
  const getQuantity = (productId: string): number => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };
  
  // Calculate final price with discount
  const calculatePrice = (product: any) => {
    if (!product.discount) return product.price;
    
    // Apply additional discount for premium users
    const discountPercentage = product.discount + (mockUser.isPremium ? 10 : 0);
    return product.price * (1 - discountPercentage / 100);
  };
  
  // Continue to checkout
  const handleContinue = () => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      if (fromTicketSelection) {
        // If from ticket selection, go to payment with both tickets and candy
        navigate(`/payment/${reservationId}`, { 
          state: { 
            candyItems: cart,
            fromCandyStore: true 
          }
        });
      } else {
        // Otherwise go to candy checkout
        navigate('/candy-checkout', { 
          state: { candyItems: cart } 
        });
      }
    }, 800);
  };
  
  // Effect to handle popup when product is added
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container className="py-5">
      {/* Success alert when adding items */}
      {showSuccessAlert && (
        <Alert 
          variant="success" 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-toast"
          style={{ zIndex: 1050 }}
        >
          Producto agregado al carrito
        </Alert>
      )}
      
      <h1 className="mb-2">Tienda de Candy</h1>
      
      {mockUser.isPremium && (
        <div className="premium-badge mb-4">
          <Badge bg="warning" text="dark" className="p-2">
            <i className="bi bi-star-fill me-2"></i>
            USUARIO PREMIUM - 10% EXTRA DE DESCUENTO EN COMBOS
          </Badge>
        </div>
      )}
      
      {fromTicketSelection && (
        <Alert variant="info" className="mb-4">
          <i className="bi bi-info-circle-fill me-2"></i>
          Agrega snacks y bebidas a tu compra de entradas. ¡Todo se podrá retirar con el mismo código QR!
        </Alert>
      )}
      
      <Row>
        <Col lg={9}>
          {/* Categories */}
          <div className="category-filters mb-4 d-flex flex-wrap">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline-secondary'}
                className="me-2 mb-2"
                onClick={() => setSelectedCategory(category.id)}
              >
                <i className={`bi ${category.iconClass} me-2`}></i>
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Products Grid */}
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredProducts.map(product => (
              <Col key={product.id}>
                <Card className="h-100 product-card">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={product.imageUrl} 
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    
                    {product.discount && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <Badge bg="danger" className="p-2">
                          {mockUser.isPremium 
                            ? `-${product.discount + 10}%` 
                            : `-${product.discount}%`}
                        </Badge>
                      </div>
                    )}
                    
                    {product.popular && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <Badge bg="warning" text="dark" className="p-2">
                          <i className="bi bi-star-fill me-2"></i>Popular
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          {product.discount ? (
                            <>
                              <span className="text-muted text-decoration-line-through me-2">
                                ${product.price}
                              </span>
                              <span className="fw-bold text-danger">${calculatePrice(product)}</span>
                            </>
                          ) : (
                            <span className="fw-bold">${product.price}</span>
                          )}
                        </div>
                        <Badge bg="secondary">{product.category}</Badge>
                      </div>
                      
                      {!isInCart(product.id) ? (
                        <Button 
                          variant="primary" 
                          className="w-100"
                          onClick={() => addToCart(product)}
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Agregar
                        </Button>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => updateQuantity(product.id, getQuantity(product.id) - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          
                          <span className="mx-2 fw-bold">{getQuantity(product.id)}</span>
                          
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => updateQuantity(product.id, getQuantity(product.id) + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        
        <Col lg={3}>
          {/* Shopping Cart */}
          <Card className="mb-4 position-sticky" style={{ top: '1rem' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-cart3 me-2"></i>
                Mi Carrito
                {cartItemCount > 0 && (
                  <Badge bg="light" text="dark" className="ms-2">{cartItemCount}</Badge>
                )}
              </h5>
            </Card.Header>
            <Card.Body>
              {cart.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-cart text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="mb-0 mt-3 text-muted">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  {cart.map(item => (
                    <div key={item.product.id} className="cart-item d-flex justify-content-between align-items-start mb-3 pb-2 border-bottom">
                      <div>
                        <h6 className="mb-0">{item.product.name}</h6>
                        <div className="d-flex align-items-center mt-1">
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="p-0 px-1"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="p-0 px-1"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <span>${item.product.price * item.quantity}</span>
                        <Button 
                          variant="link" 
                          className="p-0 text-danger" 
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Cart Summary */}
                  <div className="d-flex justify-content-between fw-bold mb-3">
                    <span>Total:</span>
                    <span>${cartTotal}</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button 
                    variant="primary" 
                    className="w-100 mb-2"
                    onClick={handleContinue}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        {fromTicketSelection ? 'Continuar con entradas y candy' : 'Proceder al pago'}
                      </>
                    )}
                  </Button>
                  
                  {/* Add Tickets Button */}
                  {!fromTicketSelection && (
                    <div className="text-center">
                      <Link to="/movies" className="btn btn-link">
                        <i className="bi bi-ticket-perforated me-1"></i>
                        Agregar entradas
                      </Link>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
          
          {/* Premium Promotion Card */}
          {!mockUser.isPremium && mockUser.isAuthenticated && (
            <Card className="premium-promo-card">
              <Card.Body>
                <h5 className="card-title">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  ¡Hazte Premium!
                </h5>
                <p className="card-text">Obtén un 10% extra de descuento en todas tus compras y disfruta de 2 entradas gratis cada mes.</p>
                <Button 
                  variant="warning" 
                  className="w-100"
                  onClick={() => navigate('/subscription')}
                >
                  Ver beneficios
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CandyStore;