// src/components/auth/UserRegistrationForm.tsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../../common/services/authService';

interface RegistrationFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface UserRegistrationFormProps {
  redirectPath?: string;
  onSuccess?: () => void;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
  redirectPath = '/login',
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegistrationFormInputs>();

  const password = watch('password', '');

  const onSubmit = async (data: RegistrationFormInputs) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Prepare registration data
      const registrationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      };

      // Call the registration API
      await authService.register(registrationData);

      // Handle successful registration
      setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
      // Wait a moment before redirecting
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(redirectPath);
        }
      }, 2000);
    } catch (err: any) {
      // Handle registration error
      console.error('Error al registrar:', err);
      setError(err?.message || 'Error al registrar usuario. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-form">
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.firstName}
                {...register('firstName', { 
                  required: 'El nombre es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  }
                })}
              />
              {errors.firstName && (
                <Form.Control.Feedback type="invalid">
                  {errors.firstName.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.lastName}
                {...register('lastName', { 
                  required: 'El apellido es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'El apellido debe tener al menos 2 caracteres'
                  }
                })}
              />
              {errors.lastName && (
                <Form.Control.Feedback type="invalid">
                  {errors.lastName.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            isInvalid={!!errors.email}
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Dirección de email inválida'
              }
            })}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid">
              {errors.email.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            isInvalid={!!errors.password}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              }
            })}
          />
          {errors.password && (
            <Form.Control.Feedback type="invalid">
              {errors.password.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            isInvalid={!!errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Por favor confirma tu contraseña',
              validate: value => 
                value === password || 'Las contraseñas no coinciden'
            })}
          />
          {errors.confirmPassword && (
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            id="agree-terms"
            label="Acepto los términos y condiciones"
            isInvalid={!!errors.agreeTerms}
            {...register('agreeTerms', {
              required: 'Debes aceptar los términos y condiciones'
            })}
          />
          {errors.agreeTerms && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {errors.agreeTerms.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          className="w-100" 
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
              Registrando...
            </>
          ) : (
            'Registrarme'
          )}
        </Button>
      </Form>

      <div className="mt-3 text-center">
        <p>
          ¿Ya tienes cuenta? <span className="text-primary" style={{cursor: 'pointer'}} onClick={() => navigate('/login')}>Iniciar Sesión</span>
        </p>
      </div>
    </div>
  );
};

export default UserRegistrationForm;