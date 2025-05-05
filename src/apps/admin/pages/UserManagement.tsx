// src/apps/admin/pages/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal, Spinner, Row, Col, Alert } from 'react-bootstrap';
import DataTable from '../../../common/components/DataTable';
import userService from '../../../common/services/userService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UserFormData {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<UserFormData> | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // En un caso real, aquí llamarías a tu API
      const response = await userService.getAllUsers(currentPage, pageSize);
      setUsers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const handleAddUser = () => {
    setCurrentUser({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'CUSTOMER'
    });
    setFormErrors({});
    setSubmitError(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '', // No mostrar contraseña existente
      role: user.role
    });
    setFormErrors({});
    setSubmitError(null);
    setShowModal(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!currentUser?.email) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(currentUser.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!currentUser?.firstName) {
      errors.firstName = 'El nombre es obligatorio';
    }
    
    if (!currentUser?.lastName) {
      errors.lastName = 'El apellido es obligatorio';
    }
    
    // Solo validar la contraseña si se está creando un usuario nuevo o si se está editando y se ingresó una contraseña
    if (!currentUser?.id && !currentUser?.password) {
      errors.password = 'La contraseña es obligatoria para nuevos usuarios';
    } else if (currentUser?.password && currentUser.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = async () => {
    if (!validateForm() || !currentUser) return;
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      if (currentUser.id) {
        // Actualizar usuario existente
        await userService.updateUser(currentUser.id, {
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          role: currentUser.role || 'CUSTOMER',
          ...(currentUser.password ? { password: currentUser.password } : {})
        });
      } else {
        // Crear nuevo usuario
        await userService.createUser({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          password: currentUser.password || '',
          role: currentUser.role || 'CUSTOMER'
        });
      }
      
      setShowModal(false);
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error: any) {
      console.error('Error saving user:', error);
      setSubmitError(error.message || 'Error al guardar el usuario. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivateUser = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
      try {
        await userService.deactivateUser(id);
        fetchUsers(); // Recargar la lista de usuarios
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    }
  };

  const handleActivateUser = async (id: string) => {
    try {
      await userService.activateUser(id);
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { header: 'Nombre', accessor: (user: User) => `${user.firstName} ${user.lastName}`, sortable: true },
    { header: 'Email', accessor: 'email' as const, sortable: true },
    { header: 'Rol', accessor: 'role' as const, sortable: true },
    { 
      header: 'Estado', 
      accessor: (user: User) => (
        <span className={user.status === 'active' ? 'text-success' : 'text-danger'}>
          {user.status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    { 
      header: 'Creado', 
      accessor: (user: User) => new Date(user.createdAt).toLocaleDateString(),
      sortable: true
    },
    {
      header: 'Acciones',
      accessor: (user: User) => (
        <div>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditUser(user)}>
            <i className="bi bi-pencil-square"></i>
          </Button>
          {user.status === 'active' ? (
            <Button variant="outline-danger" size="sm" onClick={() => handleDeactivateUser(user.id)}>
              <i className="bi bi-person-x"></i>
            </Button>
          ) : (
            <Button variant="outline-success" size="sm" onClick={() => handleActivateUser(user.id)}>
              <i className="bi bi-person-check"></i>
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios</h1>
        <Button variant="primary" onClick={handleAddUser}>
          <i className="bi bi-person-plus me-2"></i>
          Agregar Usuario
        </Button>
      </div>
      
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              keyField="id"
              searchable
              searchPlaceholder="Buscar usuarios..."
            />
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              {/* Componente de paginación, implementación depende de tu diseño */}
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Modal para agregar/editar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{currentUser?.id ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentUser?.firstName || ''}
                    onChange={(e) => setCurrentUser({...currentUser, firstName: e.target.value})}
                    isInvalid={!!formErrors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentUser?.lastName || ''}
                    onChange={(e) => setCurrentUser({...currentUser, lastName: e.target.value})}
                    isInvalid={!!formErrors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser?.email || ''}
                onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>{currentUser?.id ? 'Contraseña (dejar vacío para mantener la actual)' : 'Contraseña'}</Form.Label>
              <Form.Control
                type="password"
                value={currentUser?.password || ''}
                onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                isInvalid={!!formErrors.password}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.password}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={currentUser?.role || 'CUSTOMER'}
                onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
              >
                <option value="CUSTOMER">Cliente</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveUser}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;