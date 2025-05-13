// src/apps/pos/pages/POSProducts.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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

interface CartItem {
  product: any;
  quantity: number;
}

const POSProducts: React.FC = () => {
  const navigate = useNavigate();
  
  // State for the component
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? candyProducts 
    : candyProducts.filter(product => product.category === selectedCategory);
  
  // Additionally filter by search term
  const searchFilteredProducts = searchTerm 
    ? filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredProducts;
  
  // Calculate total for cart
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
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
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle customer info change
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };
  
  // Process order
  const processOrder = () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Reset the state after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setCart([]);
        setCustomerInfo({
          name: '',
          phone: '',
          email: ''
        });
        setPaymentMethod('cash');
      }, 3000);
    }, 1500);
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  return (
    <Container fluid className="py-3">
      {/* Success alert */}
      {showSuccess && (
        <Alert 
          variant="success" 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-toast"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill fs-4 me-2"></i>
            <div>
              <strong>¡Venta completada con éxito!</strong>
              <div>Se ha enviado el comprobante a {customerInfo.email || "la impresora"}</div>
            </div>
          </div>
        </Alert>
      )}
      
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Productos y Candy</h4>
                <Form.Control
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-50"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              {/* Categories */}
              <div className="category-filters mb-3 d-flex flex-wrap">
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
              
              {/* Products */}
              <Row xs={2} md={3} lg={4} className="g-3">
                {searchFilteredProducts.map(product => (
                  <Col key={product.id}>
                    <Card 
                      className="h-100 pos-product-card"
                      onClick={() => addToCart(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Img 
                        variant="top" 
                        src={product.imageUrl} 
                        style={{ height: '120px', objectFit: 'cover' }}
                      />
                      <Card.Body className="p-2">
                        <Card.Title className="h6 mb-1">{product.name}</Card.Title>
                        <div className="d-flex justify-content-between align-items-center">
                          <Badge bg="secondary">${product.price}</Badge>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              
              {searchFilteredProducts.length === 0 && (
                <div className="text-center py-4">
                  <i className="bi bi-search text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="mt-2 mb-0">No se encontraron productos con ese término de búsqueda</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="pos-cart-card">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-cart3 me-2"></i>
                Carrito de Venta
                {cartItemCount > 0 && (
                  <Badge bg="light" text="dark" className="ms-2">{cartItemCount}</Badge>
                )}
              </h5>
            </Card.Header>
            <Card.Body>
              {cart.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-cart text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="mb-0 mt-3 text-muted">El carrito está vacío</p>
                  <small className="text-muted">Agrega productos haciendo clic en las tarjetas de productos</small>
                </div>
              ) : (
                <>
                  <div className="cart-items mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {cart.map(item => (
                      <div key={item.product.id} className="cart-item d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            className="me-2"
                          />
                          <div>
                            <div className="fw-semibold">{item.product.name}</div>
                            <div className="text-muted small">${item.product.price} c/u</div>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center">
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
                          <Button 
                            variant="link" 
                            className="text-danger ms-2 p-0"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-summary mb-3">
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>${cartTotal}</span>
                    </div>
                  </div>
                  
                  <div className="customer-info mb-3">
                    <h6>Información del Cliente (opcional)</h6>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Nombre del cliente"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleCustomerInfoChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="email"
                        placeholder="Email (para recibo)"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        type="tel"
                        placeholder="Teléfono"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleCustomerInfoChange}
                      />
                    </Form.Group>
                  </div>
                  
                  <div className="payment-method mb-3">
                    <h6>Método de Pago</h6>
                    <div className="d-flex gap-2">
                      <Button
                        variant={paymentMethod === 'cash' ? 'primary' : 'outline-secondary'}
                        className="flex-grow-1"
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <i className="bi bi-cash me-2"></i>
                        Efectivo
                      </Button>
                      <Button
                        variant={paymentMethod === 'card' ? 'primary' : 'outline-secondary'}
                        className="flex-grow-1"
                        onClick={() => setPaymentMethod('card')}
                      >
                        <i className="bi bi-credit-card me-2"></i>
                        Tarjeta
                      </Button>
                      <Button
                        variant={paymentMethod === 'mp' ? 'primary' : 'outline-secondary'}
                        className="flex-grow-1"
                        onClick={() => setPaymentMethod('mp')}
                      >
                        <i className="bi bi-wallet2 me-2"></i>
                        MP
                      </Button>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={processOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-bag-check me-2"></i>
                          Completar Venta (${cartTotal})
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={clearCart}
                      disabled={isProcessing}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Limpiar Carrito
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => navigate('/pos/checkout')}
                      disabled={cart.length === 0 || isProcessing}
                    >
                      <i className="bi bi-printer me-2"></i>
                      Imprimir Ticket
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default POSProducts;