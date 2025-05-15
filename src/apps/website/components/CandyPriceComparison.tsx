import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface CandyPriceComparisonProps {
  regularPrice: number;
  premiumDiscount: number; // percentage
  isPremium: boolean;
}

const CandyPriceComparison: React.FC<CandyPriceComparisonProps> = ({ 
  regularPrice, 
  premiumDiscount, 
  isPremium 
}) => {
  // Calculate premium price with discount
  const premiumPrice = regularPrice * (1 - premiumDiscount / 100);
  const savingsAmount = regularPrice - premiumPrice;
  
  return (
    <Card className="mb-4 border-primary">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Precios Especiales para Miembros Premium</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6} className="border-end">
            <div className="text-center mb-3">
              <h6>Precio Regular</h6>
              <h3>${regularPrice.toFixed(2)}</h3>
            </div>
          </Col>
          <Col md={6}>
            <div className="text-center mb-3">
              <h6>
                Precio Premium 
                <Badge bg="warning" text="dark" className="ms-2">
                  {premiumDiscount}% OFF
                </Badge>
              </h6>
              <h3 className="text-primary">${premiumPrice.toFixed(2)}</h3>
            </div>
          </Col>
        </Row>
        
        {!isPremium && (
          <div className="text-center mt-3">
            <p className="mb-1">Haciéndote premium ahorrarías:</p>
            <h4 className="text-success">${savingsAmount.toFixed(2)}</h4>
            <p className="text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              Los usuarios premium obtienen {premiumDiscount}% de descuento en todos los productos de candy
            </p>
            <Link to="/subscription" className="btn btn-sm btn-warning mt-2">
              <i className="bi bi-star-fill me-2"></i>
              Hazte Premium
            </Link>
          </div>
        )}
        
        {isPremium && (
          <div className="alert alert-success text-center mt-3 mb-0">
            <i className="bi bi-check-circle-fill me-2"></i>
            Estás ahorrando <strong>${savingsAmount.toFixed(2)}</strong> con tu membresía premium
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CandyPriceComparison;