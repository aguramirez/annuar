import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../common/context/ThemeContext';
import CandyPricingComparison from '../components/CandyPricingComparison';

// Mock data for candy products
const candyProducts = [
  {
    id: '1',
    name: 'Combo Familiar',
    description: 'Popcorn grande + 4 Gaseosas medianas + 2 Chocolates',
    price: 2000,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000198.png?v=00002574',
    category: 'combos',
    discount: 20,
    popular: true,
    stock: 35
  },
  {
    id: '2',
    name: 'Combo Pareja',
    description: 'Popcorn grande + 2 Gaseosas medianas',
    price: 1400,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000196.png?v=00002574',
    category: 'combos',
    discount: 15,
    popular: true,
    stock: 25
  },
  {
    id: '3',
    name: 'Popcorn Grande',
    description: 'Popcorn recién hecho en balde grande',
    price: 800,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000011.png?v=00002574',
    category: 'popcorn',
    popular: true,
    stock: 80
  },
  {
    id: '4',
    name: 'Popcorn Mediano',
    description: 'Popcorn recién hecho en balde mediano',
    price: 600,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000010.png?v=00002574',
    category: 'popcorn',
    stock: 120
  },
  {
    id: '5',
    name: 'Nachos con Queso',
    description: 'Crujientes nachos con salsa de queso',
    price: 700,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000038.png?v=00002574',
    category: 'snacks',
    popular: true,
    stock: 45
  },
  {
    id: '6',
    name: 'Gaseosa Grande',
    description: 'Coca-Cola, Sprite o Fanta (selecciona al retirar)',
    price: 400,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000028.png?v=00002574',
    category: 'drinks',
    stock: 150
  },
  {
    id: '7',
    name: 'Gaseosa Mediana',
    description: 'Coca-Cola, Sprite o Fanta (selecciona al retirar)',
    price: 300,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000027.png?v=00002574',
    category: 'drinks',
    stock: 200
  },
  {
    id: '8',
    name: 'Agua Mineral',
    description: 'Botella de agua mineral 500ml',
    price: 200,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000013.png?v=00002574',
    category: 'drinks',
    stock: 120
  },
  {
    id: '9',
    name: 'Chocolate',
    description: 'Barra de chocolate con leche',
    price: 250,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000004153.png?v=00002574',
    category: 'sweets',
    stock: 75
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
  isPremium: true,
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
  const [showLowStockAlert, setShowLowStockAlert] = useState(false);
  const [localProducts, setLocalProducts] = useState(candyProducts);
  
  // Check if we're coming from ticket selection
  const fromTicketSelection = location.state?.fromTicketSelection || false;
  const reservationId = location.state?.reservationId || 'mock-reservation-123';
  
  // Calculate total items and price in cart
  const cartTotal = cart.reduce((total, item) => {
    // Apply premium discount if applicable
    const price = mockUser.isPremium && item.product.discount 
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    
    return total + (price * item.quantity);
  }, 0);
  
  const regularCartTotal = cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? localProducts 
    : localProducts.filter(product => product.category === selectedCategory);
  
  // Add to cart function
  const addToCart = (product: any) => {
    // Check if product has stock
    if (product.stock <= 0) {
      setShowLowStockAlert(true);
      setTimeout(() => setShowLowStockAlert(false), 3000);
      return;
    }
    
    setCart(prevCart => {
      // Check if product already in cart
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Check if trying to add more than available stock
        if (existingItem.quantity >= product.stock) {
          setShowLowStockAlert(true);
          setTimeout(() => setShowLowStockAlert(false), 3000);
          return prevCart;
        }
        
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
    
    // Update product stock
    setLocalProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id 
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );
    
    // Show success message
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 2000);
  };
  
  // Remove from cart
  const removeFromCart = (productId: string) => {
    // Get quantity of product in cart before removing
    const itemInCart = cart.find(item => item.product.id === productId);
    const quantityToRestore = itemInCart ? itemInCart.quantity : 0;
    
    // Remove from cart
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    
    // Restore stock
    if (quantityToRestore > 0) {
      setLocalProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, stock: p.stock + quantityToRestore }
            : p
        )
      );
    }
  };
  
  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Find product in local products
    const product = localProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Find current quantity in cart
    const currentItem = cart.find(item => item.product.id === productId);
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    
    // Check if trying to add more than available stock
    const availableStock = product.stock + currentQuantity;
    if (newQuantity > availableStock) {
      setShowLowStockAlert(true);
      setTimeout(() => setShowLowStockAlert(false), 3000);
      return;
    }
    
    // Update cart
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
    
    // Update product stock
    const stockDifference = currentQuantity - newQuantity;
    setLocalProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId 
          ? { ...p, stock: p.stock + stockDifference }
          : p
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
  
  // Calculate premium discount price
  const calculateDiscountedPrice = (product: any) => {
    if (!mockUser.isPremium || !product.discount) return product.price;
    return product.price * (1 - product.discount / 100);
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
  
  // Find product with highest discount for comparison
  const highestDiscountProduct = localProducts
    .filter(p => p.discount)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))[0];
  
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
      
      {/* Low stock alert */}
      {showLowStockAlert && (
        <Alert 
          variant="warning" 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-toast"
          style={{ zIndex: 1050 }}
        >
          Stock insuficiente para este producto
        </Alert>
      )}
      
      <h1 className="mb-2">Tienda de Candy</h1>
      
      {mockUser.isPremium && (
        <div className="premium-badge mb-4">
          <Badge bg="warning" text="dark" className="p-2">
            <i className="bi bi-star-fill me-2"></i>
            USUARIO PREMIUM - DESCUENTOS EXCLUSIVOS EN COMBOS
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
          
          {/* Price comparison for premium users */}
          {highestDiscountProduct && (
            <CandyPricingComparison 
              regularPrice={highestDiscountProduct.price}
              premiumDiscount={highestDiscountProduct.discount || 0}
              isPremium={mockUser.isPremium}
            />
          )}
          
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
                            ? `-${product.discount}%` 
                            : product.discount ? 'PREMIUM' : ''}
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
                          {mockUser.isPremium && product.discount ? (
                            <>
                              <span className="text-muted text-decoration-line-through me-2">
                                ${product.price}
                              </span>
                              <span className="fw-bold text-danger">${calculateDiscountedPrice(product)}</span>
                            </>
                          ) : (
                            <span className="fw-bold">${product.price}</span>
                          )}
                        </div>
                        <Badge bg={product.stock > 10 ? 'success' : (product.stock > 0 ? 'warning' : 'danger')}>
                          Stock: {product.stock}
                        </Badge>
                      </div>
                      
                      {!isInCart(product.id) ? (
                        <Button 
                          variant="primary" 
                          className="w-100"
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          {product.stock > 0 ? 'Agregar' : 'Sin stock'}
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
                            disabled={product.stock <= 0}
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
                            disabled={localProducts.find(p => p.id === item.product.id)?.stock <= 0}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        {mockUser.isPremium && item.product.discount ? (
                          <>
                            <span className="text-muted text-decoration-line-through small">
                              ${item.product.price * item.quantity}
                            </span>
                            <span>${(calculateDiscountedPrice(item.product) * item.quantity).toFixed(2)}</span>
                          </>
                        ) : (
                          <span>${item.product.price * item.quantity}</span>
                        )}
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
                  {mockUser.isPremium && cartTotal !== regularCartTotal && (
                    <div className="d-flex justify-content-between text-muted mb-2">
                      <span>Subtotal:</span>
                      <span className="text-decoration-line-through">${regularCartTotal.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between fw-bold mb-3">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  {mockUser.isPremium && cartTotal !== regularCartTotal && (
                    <div className="alert alert-success p-2 text-center mb-3">
                      <small>
                        <i className="bi bi-piggy-bank-fill me-1"></i>
                        Ahorro Premium: ${(regularCartTotal - cartTotal).toFixed(2)}
                      </small>
                    </div>
                  )}
                  
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
                      <Button as="a" href="/movies" className="btn btn-link">
                        <i className="bi bi-ticket-perforated me-1"></i>
                        Agregar entradas
                      </Button>
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