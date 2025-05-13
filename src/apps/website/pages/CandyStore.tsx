// src/apps/website/pages/CandyStore.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import candyService, { CandyProduct, CandyCategory } from '../../../common/services/candyService';
import { useCart } from '../../../common/context/CartContext';
import { useFirebaseAuth } from '../../../auth/FirebaseAuthContext';

const CandyStore: React.FC = () => {
  const [products, setProducts] = useState<CandyProduct[]>([]);
  const [categories, setCategories] = useState<CandyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const { cart, addToCart, removeFromCart, updateQuantity, isInCart, getCartItemQuantity } = useCart();
  const { currentUser, isAuthenticated } = useFirebaseAuth();
  const isPremium = currentUser?.role === 'PREMIUM';
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Verificar si venimos del flujo de compra de entradas
  const fromTicketPurchase = location.state?.fromTicketPurchase || false;
  const reservationId = location.state?.reservationId || null;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos y categorías
        const productsData = await candyService.getAllProducts();
        const categoriesData = await candyService.getCategories();
        
        setProducts(productsData);
        setCategories(categoriesData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching candy products:', err);
        setError('No se pudieron cargar los productos. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filtrar productos por categoría
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);
  
  // Calcular precio con descuento
  const calculateDiscountedPrice = (product: CandyProduct): number => {
    if (!product.discount) return product.price;
    
    // Aplicar descuento adicional para usuarios Premium
    let discountPercent = product.discount;
    if (isPremium) {
      discountPercent += 10; // 10% adicional para usuarios Premium
    }
    
    return product.price * (1 - discountPercent / 100);
  };
  
  // Continuar al checkout
  const handleContinueToCheckout = () => {
    if (fromTicketPurchase && reservationId) {
      // Si venimos de compra de entradas, volver al flujo de pago
      navigate(`/payment/${reservationId}`, { state: { hasCandy: true } });
    } else {
      // Si es compra directa de candy, ir al checkout de candy
      navigate('/candy/checkout');
    }
  };
  
  // Manejar cambio de cantidad
  const handleQuantityChange = (product: CandyProduct, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tienda Candy</h1>
        
        {isPremium && (
          <Badge bg="warning" text="dark" className="premium-badge px-3 py-2">
            <i className="bi bi-star-fill me-2"></i>
            PREMIUM - 10% Extra de Descuento
          </Badge>
        )}
      </div>
      
      {/* Mensaje para usuarios premium */}
      {isPremium && (
        <Alert variant="info" className="mb-4">
          <i className="bi bi-info-circle-fill me-2"></i>
          Como usuario Premium, disfrutas de un 10% adicional de descuento en todos los productos con promoción.
        </Alert>
      )}
      
      {/* Mensaje para usuarios en flujo de compra de entradas */}
      {fromTicketPurchase && (
        <Alert variant="success" className="mb-4">
          <i className="bi bi-check-circle-fill me-2"></i>
          Aprovecha y añade snacks y bebidas a tu compra de entradas. Todo se podrá retirar con el mismo código QR.
        </Alert>
      )}
      
      <Row>
        <Col lg={9}>
          {/* Filtros de categoría */}
          <div className="category-filters mb-4 d-flex flex-wrap">
            <Button 
              variant={activeCategory === 'all' ? 'primary' : 'outline-secondary'} 
              className="me-2 mb-2"
              onClick={() => setActiveCategory('all')}
            >
              Todos
            </Button>
            
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'primary' : 'outline-secondary'}
                className="me-2 mb-2 d-flex align-items-center"
                onClick={() => setActiveCategory(category.id)}
              >
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="me-2" 
                  width="20" 
                  height="20" 
                />
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Productos */}
          <Row xs={1} md={2} lg={3} className="g-4 mb-4">
            {filteredProducts.map(product => {
              const isInCartAlready = isInCart(product.id);
              const quantity = getCartItemQuantity(product.id);
              const discountedPrice = calculateDiscountedPrice(product);
              const hasDiscount = product.discount !== undefined;
              
              return (
                <Col key={product.id}>
                  <Card className="h-100 product-card">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="product-image"
                      />
                      
                      {hasDiscount && (
                        <div className="position-absolute top-0 end-0 m-2">
                          <Badge bg="danger" className="discount-badge">
                            -{product.discount + (isPremium ? 10 : 0)}%
                          </Badge>
                        </div>
                      )}
                      
                      {product.isPopular && (
                        <div className="position-absolute top-0 start-0 m-2">
                          <Badge bg="warning" text="dark" className="popular-badge">
                            <i className="bi bi-star-fill me-1"></i> Popular
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
                            {hasDiscount ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-2">
                                  ${product.price}
                                </span>
                                <span className="product-price">${discountedPrice.toFixed(0)}</span>
                              </>
                            ) : (
                              <span className="product-price">${product.price}</span>
                            )}
                          </div>
                          
                          <Badge bg="secondary">{
                            categories.find(c => c.id === product.category)?.name || product.category
                          }</Badge>
                        </div>
                        
                        {isInCartAlready ? (
                          <div className="d-flex align-items-center">
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleQuantityChange(product, quantity - 1)}
                            >
                              <i className="bi bi-dash"></i>
                            </Button>
                            <span className="mx-3">{quantity}</span>
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleQuantityChange(product, quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="primary" 
                            className="w-100"
                            onClick={() => addToCart(product)}
                          >
                            <i className="bi bi-cart-plus me-2"></i>
                            Añadir
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
        
        <Col lg={3}>
          {/* Carrito de compras */}
          <Card className="cart-sidebar sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-cart3 me-2"></i>
                Tu Pedido
                {cart.itemCount > 0 && (
                  <Badge bg="light" text="dark" className="ms-2">{cart.itemCount}</Badge>
                )}
              </h5>
            </Card.Header>
            <Card.Body>
              {cart.items.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-cart text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="mt-3 mb-0 text-muted">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {cart.items.map(item => (
                    <div key={item.product.id} className="cart-item mb-3 p-2 border-bottom">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="product-name">{item.product.name}</span>
                        <Button 
                          variant="link" 
                          className="p-0 text-danger" 
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <i className="bi bi-x-circle"></i>
                        </Button>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            className="p-0 px-1"
                            onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="p-0 px-1"
                            onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                        
                        <span>${(item.product.price * item.quantity).toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="cart-total d-flex justify-content-between mt-3">
                    <strong>Total:</strong>
                    <strong>${cart.total.toFixed(0)}</strong>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-100 mt-3"
                    onClick={handleContinueToCheckout}
                    disabled={cart.items.length === 0}
                  >
                    {fromTicketPurchase ? 'Continuar con mi compra' : 'Proceder al pago'}
                  </Button>
                  
                  {!fromTicketPurchase && (
                    <div className="text-center mt-3">
                      <Link to="/movies" className="btn btn-link">Agregar entradas</Link>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Promoción de la membresía Premium para usuarios no premium */}
      {!isPremium && isAuthenticated && (
        <Card className="mt-5 premium-promotion">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h3 className="mb-3">¡Hazte PREMIUM y obtén beneficios exclusivos!</h3>
                <p className="mb-3">Como miembro Premium disfrutarás de:</p>
                <ul>
                  <li>2 entradas gratis cada mes</li>
                  <li>10% de descuento adicional en todos los productos de nuestra tienda</li>
                  <li>Acceso anticipado a preventa de películas</li>
                  <li>Sin cargos por servicios en la compra de entradas</li>
                </ul>
              </Col>
              <Col md={4} className="text-center">
                <Button 
                  variant="warning" 
                  size="lg" 
                  className="premium-button"
                  onClick={() => navigate('/subscription')}
                >
                  <i className="bi bi-star-fill me-2"></i>
                  Hazte Premium
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CandyStore;