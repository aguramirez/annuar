// src/apps/platform/components/CreateCinema.tsx
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

// Definimos la interfaz para los datos del formulario
interface CinemaFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  active: boolean;
}

const CreateCinema: React.FC = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<CinemaFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    active: true
  });
  
  // Estados para manejar la UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error de validación para el campo
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Limpiar mensajes de éxito/error al modificar el formulario
    if (success || error) {
      setSuccess(null);
      setError(null);
    }
  };
  
  // Validar el formulario
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre del cine es obligatorio';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'La dirección es obligatoria';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'La ciudad es obligatoria';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'La provincia/estado es obligatoria';
    }
    
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'El código postal es obligatorio';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es obligatorio';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    // Si hay URL de sitio web, validar formato
    if (formData.website && !formData.website.match(/^(https?:\/\/)?([\w\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
      errors.website = 'URL de sitio web inválida';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Realizar la petición al backend para crear el cine
      const response = await axios.post('/api/admin/cinemas', formData);
      
      // Mostrar mensaje de éxito
      setSuccess(`Cine "${formData.name}" creado exitosamente con ID: ${response.data.id}`);
      
      // Resetear el formulario
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        email: '',
        website: '',
        active: true
      });
    } catch (err: any) {
      // Mostrar mensaje de error
      setError(err.response?.data?.message || 'Error al crear el cine. Por favor, intenta de nuevo.');
      console.error('Error al crear cine:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">Crear Nuevo Cine</h4>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Cine*</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email*</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Dirección*</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              isInvalid={!!validationErrors.address}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.address}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Ciudad*</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Provincia/Estado*</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.state}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Código Postal*</Form.Label>
                <Form.Control
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.postalCode}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.postalCode}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono*</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sitio Web</Form.Label>
                <Form.Control
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.website}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.website}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="active"
              id="cinema-active"
              label="Cine activo"
              checked={formData.active}
              onChange={handleChange}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Creando...
                </>
              ) : (
                'Crear Cine'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateCinema;