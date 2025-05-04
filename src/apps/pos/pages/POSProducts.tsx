// src/apps/pos/pages/POSProducts.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
}

interface CartItem {
  id: string;
  type: 'product' | 'combo';
  name: string;
  price: number;
  quantity: number;
}

const POSProducts: React.FC = () => {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('products');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos
    const fetchData = async () => {
      // Simular categorías
      const categoriesData: Category[] = [
        { id: '1', name: 'Bebidas', imageUrl: 'https://via.placeholder.com/50' },
        { id: '2', name: 'Snacks', imageUrl: 'https://via.placeholder.com/50' },
        { id: '3', name: 'Dulces', imageUrl: 'https://via.placeholder.com/50' }
      ];
      
      // Simular productos
      const productsData: Product[] = [
        {
          id: '1',
          categoryId: '1',
          name: 'Gaseosa Grande',
          description: 'Coca-Cola, Sprite o Fanta (500ml)',
          price: 300,
          imageUrl: 'https://via.placeholder.com/100'
        },
        {
          id: '2',
          categoryId: '1',
          name: 'Agua Mineral',
          description: 'Botella 500ml',
          price: 200,
          imageUrl: 'https://via.placeholder.com/100'
        },
        {
          id: '3',
          categoryId: '2',
          name: 'Popcorn Grande',
          description: 'Balde grande de pochoclos con manteca',
          price: 450,
          imageUrl: 'https://via.placeholder.com/100'
        },
        {
          id: '4',
          categoryId: '2',
          name: 'Nachos',
          description: 'Con salsa de queso',
          price: 400,
          imageUrl: 'https://via.placeholder.com/100'
        },
        {
          id: '5',
          categoryId: '3',
          name: 'Chocolate',
          description: 'Barra de chocolate con leche',
          price: 250,
          imageUrl: 'https://via.placeholder.com/100'
        }
      ];
      
      // Simular combos
      const combosData: Combo[] = [
        {
          id: '1',
          name: 'Combo Familiar',
          description: 'Ideal para compartir en familia',
          price: 950,
          imageUrl: 'https://via.placeholder.com/100',
          items: [
            { productId: '1', productName: 'Gaseosa Grande', quantity: 2 },
            { productId: '3', productName: 'Popcorn Grande', quantity: 1 }
          ]
        },
        {
          id: '2',
          name: 'Combo Individual',
          description: 'Para disfrutar solo',
          price: 650,
          imageUrl: 'https://via.placeholder.com/100',
          items: [
            { productId: '1', productName: 'Gaseosa Grande', quantity: 1 },
            { productId: '3', productName: 'Popcorn Grande', quantity: 1 }
          ]
        },
        {
          id: '3',
          name: 'Combo Snack',
          description: 'Para picar',
          price: 750,
          imageUrl: 'https://via.placeholder.com/100',
          items: [
            { productId: '1', productName: 'Gaseosa Grande', quantity: 1 },
            { productId: '4', productName: 'Nachos', quantity: 1 },
            { productId: '5', productName: 'Chocolate', quantity: 1 }
          ]
        }
      ];
      
      setCategories(categoriesData);
      setProducts(productsData);
      setCombos(combosData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.id === item.id && cartItem.type === item.type
    );
    
    if (existingItemIndex >= 0) {
      // El ítem ya existe en el carrito, incrementar cantidad
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
      setCartItems(newCartItems);
    } else {
      // Nuevo ítem
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (index: number) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = quantity;
    setCartItems(newCartItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigate('/pos/checkout');
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.categoryId === activeCategory);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Productos</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'products')}
                className="mb-4"
              >
                <Tab eventKey="products" title="Productos Individuales">
                  <div className="category-filter mb-4 d-flex overflow-auto">
                    <Button
                      variant={activeCategory === 'all' ? 'primary' : 'outline-secondary'}
                      className="me-2 category-btn"
                      onClick={() => setActiveCategory('all')}
                    >
                      Todos
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? 'primary' : 'outline-secondary'}
                        className="me-2 category-btn d-flex align-items-center"
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <img 
                          src={category.imageUrl} 
                          alt={category.name} 
                          className="category-icon me-2" 
                          width="20" 
                          height="20" 
                        />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                  
                  <Row xs={1} md={2} lg={3} className="g-3">
                    {filteredProducts.map(product => (
                      <Col key={product.id}>
                        <Card className="h-100 product-card">
                          <div className="product-img-container">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="product-img"
                            />
                          </div>
                          <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>{product.description}</Card.Text>
                            <div className="d-flex justify-content-between align-items-center mt-auto">
                              <span className="product-price">${product.price}</span>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => addToCart({
                                  id: product.id,
                                  type: 'product',
                                  name: product.name,
                                  price: product.price
                                })}
                              >
                                <i className="bi bi-plus-lg"></i> Agregar
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab>
                
                <Tab eventKey="combos" title="Combos">
                  <Row xs={1} md={2} className="g-3">
                    {combos.map(combo => (
                      <Col key={combo.id}>
                        <Card className="h-100 combo-card">
                          <div className="d-flex">
                            <div className="combo-img-container">
                              <img
                                src={combo.imageUrl}
                                alt={combo.name}
                                className="combo-img"
                              />
                            </div>
                            <Card.Body>
                              <Card.Title>{combo.name}</Card.Title>
                              <Card.Text>{combo.description}</Card.Text>
                              
                              <div className="combo-items small mb-3">
                                <strong>Incluye:</strong>
                                <ul className="ps-3 mb-0">
                                  {combo.items.map((item, index) => (
                                    <li key={index}>
                                      {item.quantity} x {item.productName}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="d-flex justify-content-between align-items-center mt-auto">
                                <span className="product-price">${combo.price}</span>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => addToCart({
                                    id: combo.id,
                                    type: 'combo',
                                    name: combo.name,
                                    price: combo.price
                                  })}
                                >
                                  <i className="bi bi-plus-lg"></i> Agregar
                                </Button>
                              </div>
                            </Card.Body>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4 cart-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-cart3 me-2"></i>
                Carrito
                {cartItems.length > 0 && (
                  <Badge bg="primary" className="ms-2">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </Badge>
                )}
              </h5>
            </Card.Header>
            <Card.Body>
              {cartItems.length === 0 ? (
                <p className="text-center text-muted">
                  El carrito está vacío
                </p>
              ) : (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item mb-3 p-2 border rounded">
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <strong>{item.name}</strong>
                          <Badge
                            bg={item.type === 'combo' ? 'info' : 'secondary'}
                            className="ms-2"
                          >
                            {item.type === 'combo' ? 'Combo' : 'Producto'}
                          </Badge>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(index)}
                          className="btn-sm p-1"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="quantity-control">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="btn-sm p-1"
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="btn-sm p-1"
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                        <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  ))}
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                    <span>Total:</span>
                    <span>${calculateTotal().toLocaleString('es-AR')}</span>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100"
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
          
          <Button 
            variant="outline-secondary" 
            className="w-100"
            onClick={() => navigate('/pos')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver a Funciones
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default POSProducts;