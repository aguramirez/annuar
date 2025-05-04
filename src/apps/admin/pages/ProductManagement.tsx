// src/apps/admin/pages/ProductManagement.tsx
import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Button, Form, Modal, Row, Col, Table, Badge, Card, Image } from 'react-bootstrap';
import DataTable from '../../../common/components/DataTable';

interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
}

interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  items: ComboItem[];
}

interface ComboItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

const ProductManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showComboModal, setShowComboModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Current edit items
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [currentCombo, setCurrentCombo] = useState<Partial<Combo> | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);

  useEffect(() => {
    // Simulación de carga de datos
    const fetchData = async () => {
      // Productos simulados
      const productsData: Product[] = [
        {
          id: '1',
          categoryId: '1',
          categoryName: 'Bebidas',
          name: 'Gaseosa Grande',
          description: 'Coca-Cola, Sprite o Fanta (500ml)',
          price: 300,
          imageUrl: 'https://via.placeholder.com/150',
          stock: 100,
          isActive: true
        },
        {
          id: '2',
          categoryId: '1',
          categoryName: 'Bebidas',
          name: 'Agua Mineral',
          description: 'Botella 500ml',
          price: 200,
          imageUrl: 'https://via.placeholder.com/150',
          stock: 150,
          isActive: true
        },
        {
          id: '3',
          categoryId: '2',
          categoryName: 'Snacks',
          name: 'Popcorn Grande',
          description: 'Balde grande de pochoclos con manteca',
          price: 450,
          imageUrl: 'https://via.placeholder.com/150',
          stock: 80,
          isActive: true
        },
      ];

      // Combos simulados
      const combosData: Combo[] = [
        {
          id: '1',
          name: 'Combo Familiar',
          description: 'Ideal para compartir en familia',
          price: 950,
          imageUrl: 'https://via.placeholder.com/150',
          isActive: true,
          items: [
            { id: '1', productId: '1', productName: 'Gaseosa Grande', quantity: 2 },
            { id: '2', productId: '3', productName: 'Popcorn Grande', quantity: 1 }
          ]
        },
        {
          id: '2',
          name: 'Combo Individual',
          description: 'Para disfrutar solo',
          price: 650,
          imageUrl: 'https://via.placeholder.com/150',
          isActive: true,
          items: [
            { id: '3', productId: '1', productName: 'Gaseosa Grande', quantity: 1 },
            { id: '4', productId: '3', productName: 'Popcorn Grande', quantity: 1 }
          ]
        }
      ];

      // Categorías simuladas
      const categoriesData: Category[] = [
        {
          id: '1',
          name: 'Bebidas',
          description: 'Refrescos, aguas y bebidas calientes',
          imageUrl: 'https://via.placeholder.com/150',
          displayOrder: 1,
          isActive: true
        },
        {
          id: '2',
          name: 'Snacks',
          description: 'Pochoclos, nachos, chocolates y más',
          imageUrl: 'https://via.placeholder.com/150',
          displayOrder: 2,
          isActive: true
        },
        {
          id: '3',
          name: 'Dulces',
          description: 'Chocolates, caramelos y golosinas',
          imageUrl: 'https://via.placeholder.com/150',
          displayOrder: 3,
          isActive: true
        }
      ];

      setProducts(productsData);
      setCombos(combosData);
      setCategories(categoriesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handlers para Productos
  const handleAddProduct = () => {
    setCurrentProduct({
      price: 0,
      stock: 0,
      isActive: true
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct({ ...product });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (currentProduct) {
      if (currentProduct.id) {
        // Actualizar producto existente
        setProducts(products.map(product => 
          product.id === currentProduct.id ? { ...product, ...currentProduct } as Product : product
        ));
      } else {
        // Crear nuevo producto
        const newProduct = {
          ...currentProduct,
          id: Math.random().toString(36).substr(2, 9),
          categoryName: categories.find(c => c.id === currentProduct.categoryId)?.name || ''
        } as Product;
        setProducts([...products, newProduct]);
      }
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  // Handlers para Combos
  const handleAddCombo = () => {
    setCurrentCombo({
      price: 0,
      isActive: true,
      items: []
    });
    setShowComboModal(true);
  };

  const handleEditCombo = (combo: Combo) => {
    setCurrentCombo({ ...combo });
    setShowComboModal(true);
  };

  const handleSaveCombo = () => {
    if (currentCombo) {
      if (currentCombo.id) {
        // Actualizar combo existente
        setCombos(combos.map(combo => 
          combo.id === currentCombo.id ? { ...combo, ...currentCombo } as Combo : combo
        ));
      } else {
        // Crear nuevo combo
        const newCombo = {
          ...currentCombo,
          id: Math.random().toString(36).substr(2, 9)
        } as Combo;
        setCombos([...combos, newCombo]);
      }
    }
    setShowComboModal(false);
  };

  const handleDeleteCombo = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este combo?')) {
      setCombos(combos.filter(combo => combo.id !== id));
    }
  };

  // Handlers para Categorías
  const handleAddCategory = () => {
    setCurrentCategory({
      displayOrder: categories.length + 1,
      isActive: true
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory({ ...category });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (currentCategory) {
      if (currentCategory.id) {
        // Actualizar categoría existente
        setCategories(categories.map(category => 
          category.id === currentCategory.id ? { ...category, ...currentCategory } as Category : category
        ));
      } else {
        // Crear nueva categoría
        const newCategory = {
          ...currentCategory,
          id: Math.random().toString(36).substr(2, 9)
        } as Category;
        setCategories([...categories, newCategory]);
      }
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      setCategories(categories.filter(category => category.id !== id));
    }
  };

  // Columnas para las tablas
  const productColumns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Nombre', accessor: 'name' as const, sortable: true },
    { header: 'Categoría', accessor: 'categoryName' as const, sortable: true },
    { 
      header: 'Precio', 
      accessor: (product: Product) => `$${product.price.toLocaleString('es-AR')}`,
      sortable: true
    },
    { header: 'Stock', accessor: 'stock' as const, sortable: true },
    {
      header: 'Estado',
      accessor: (product: Product) => (
        <Badge bg={product.isActive ? 'success' : 'secondary'}>
          {product.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      accessor: (product: Product) => (
        <div>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditProduct(product)}>
            <i className="bi bi-pencil-square"></i>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      )
    }
  ];

  const comboColumns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Nombre', accessor: 'name' as const, sortable: true },
    { 
      header: 'Precio', 
      accessor: (combo: Combo) => `$${combo.price.toLocaleString('es-AR')}`,
      sortable: true
    },
    {
      header: 'Productos',
      accessor: (combo: Combo) => combo.items.length
    },
    {
      header: 'Estado',
      accessor: (combo: Combo) => (
        <Badge bg={combo.isActive ? 'success' : 'secondary'}>
          {combo.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      accessor: (combo: Combo) => (
        <div>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditCombo(combo)}>
            <i className="bi bi-pencil-square"></i>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCombo(combo.id)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      )
    }
  ];

  const categoryColumns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Nombre', accessor: 'name' as const, sortable: true },
    { header: 'Descripción', accessor: 'description' as const },
    { header: 'Orden', accessor: 'displayOrder' as const, sortable: true },
    {
      header: 'Estado',
      accessor: (category: Category) => (
        <Badge bg={category.isActive ? 'success' : 'secondary'}>
          {category.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      accessor: (category: Category) => (
        <div>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditCategory(category)}>
            <i className="bi bi-pencil-square"></i>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      )
    }
  ];

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
    <Container fluid className="py-4">
      <h1 className="mb-4">Gestión de Productos</h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'products')}
        className="mb-4"
      >
        <Tab eventKey="products" title="Productos">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={handleAddProduct}>
              <i className="bi bi-plus-lg me-2"></i>
              // src/apps/admin/pages/ProductManagement.tsx (continuación)
              Agregar Producto
            </Button>
          </div>
          
          <DataTable
            columns={productColumns}
            data={products}
            keyField="id"
            searchable
            searchPlaceholder="Buscar productos..."
          />
        </Tab>
        
        <Tab eventKey="combos" title="Combos">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={handleAddCombo}>
              <i className="bi bi-plus-lg me-2"></i>
              Agregar Combo
            </Button>
          </div>
          
          <DataTable
            columns={comboColumns}
            data={combos}
            keyField="id"
            searchable
            searchPlaceholder="Buscar combos..."
          />
        </Tab>
        
        <Tab eventKey="categories" title="Categorías">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={handleAddCategory}>
              <i className="bi bi-plus-lg me-2"></i>
              Agregar Categoría
            </Button>
          </div>
          
          <DataTable
            columns={categoryColumns}
            data={categories}
            keyField="id"
            searchable
            searchPlaceholder="Buscar categorías..."
          />
        </Tab>
      </Tabs>
      
      {/* Modal para Productos */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct?.id ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control 
                    type="text"
                    value={currentProduct?.name || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select 
                    value={currentProduct?.categoryId || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, categoryId: e.target.value})}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                value={currentProduct?.description || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
              />
            </Form.Group>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control 
                    type="number"
                    value={currentProduct?.price || 0}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control 
                    type="number"
                    value={currentProduct?.stock || 0}
                    onChange={(e) => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={currentProduct?.isActive ? "true" : "false"}
                    onChange={(e) => setCurrentProduct({...currentProduct, isActive: e.target.value === "true"})}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>URL de imagen</Form.Label>
              <Form.Control 
                type="text"
                value={currentProduct?.imageUrl || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, imageUrl: e.target.value})}
              />
            </Form.Group>
            
            {currentProduct?.imageUrl && (
              <div className="text-center mb-3">
                <p>Vista previa de la imagen:</p>
                <img 
                  src={currentProduct.imageUrl} 
                  alt="Vista previa" 
                  className="img-thumbnail" 
                  style={{ maxHeight: '150px' }} 
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal para Combos */}
      <Modal show={showComboModal} onHide={() => setShowComboModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentCombo?.id ? 'Editar Combo' : 'Agregar Combo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text"
                value={currentCombo?.name || ''}
                onChange={(e) => setCurrentCombo({...currentCombo, name: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                value={currentCombo?.description || ''}
                onChange={(e) => setCurrentCombo({...currentCombo, description: e.target.value})}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control 
                    type="number"
                    value={currentCombo?.price || 0}
                    onChange={(e) => setCurrentCombo({...currentCombo, price: parseFloat(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={currentCombo?.isActive ? "true" : "false"}
                    onChange={(e) => setCurrentCombo({...currentCombo, isActive: e.target.value === "true"})}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>URL de imagen</Form.Label>
              <Form.Control 
                type="text"
                value={currentCombo?.imageUrl || ''}
                onChange={(e) => setCurrentCombo({...currentCombo, imageUrl: e.target.value})}
              />
            </Form.Group>
            
            {currentCombo?.imageUrl && (
              <div className="text-center mb-3">
                <p>Vista previa de la imagen:</p>
                <img 
                  src={currentCombo.imageUrl} 
                  alt="Vista previa" 
                  className="img-thumbnail" 
                  style={{ maxHeight: '150px' }} 
                />
              </div>
            )}
            
            <hr />
            
            <h5 className="mb-3">Productos incluidos</h5>
            
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style={{ width: '100px' }}>Cantidad</th>
                  <th style={{ width: '80px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentCombo?.items?.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>
                      <Form.Select
                        value={item.productId}
                        onChange={(e) => {
                          const newItems = [...(currentCombo?.items || [])];
                          newItems[index] = {
                            ...newItems[index],
                            productId: e.target.value,
                            productName: products.find(p => p.id === e.target.value)?.name || ''
                          };
                          setCurrentCombo({...currentCombo, items: newItems});
                        }}
                      >
                        <option value="">Seleccionar producto</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...(currentCombo?.items || [])];
                          newItems[index] = {
                            ...newItems[index],
                            quantity: parseInt(e.target.value) || 1
                          };
                          setCurrentCombo({...currentCombo, items: newItems});
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          const newItems = [...(currentCombo?.items || [])];
                          newItems.splice(index, 1);
                          setCurrentCombo({...currentCombo, items: newItems});
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                const newItem = {
                  id: Math.random().toString(36).substr(2, 9),
                  productId: '',
                  productName: '',
                  quantity: 1
                };
                setCurrentCombo({
                  ...currentCombo,
                  items: [...(currentCombo?.items || []), newItem]
                });
              }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Agregar Producto
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowComboModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveCombo}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal para Categorías */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentCategory?.id ? 'Editar Categoría' : 'Agregar Categoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text"
                value={currentCategory?.name || ''}
                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                value={currentCategory?.description || ''}
                onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Orden de visualización</Form.Label>
                  <Form.Control 
                    type="number"
                    value={currentCategory?.displayOrder || 0}
                    onChange={(e) => setCurrentCategory({...currentCategory, displayOrder: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={currentCategory?.isActive ? "true" : "false"}
                    onChange={(e) => setCurrentCategory({...currentCategory, isActive: e.target.value === "true"})}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>URL de imagen</Form.Label>
              <Form.Control 
                type="text"
                value={currentCategory?.imageUrl || ''}
                onChange={(e) => setCurrentCategory({...currentCategory, imageUrl: e.target.value})}
              />
            </Form.Group>
            
            {currentCategory?.imageUrl && (
              <div className="text-center mb-3">
                <p>Vista previa de la imagen:</p>
                <img 
                  src={currentCategory.imageUrl} 
                  alt="Vista previa" 
                  className="img-thumbnail" 
                  style={{ maxHeight: '150px' }} 
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveCategory}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductManagement;