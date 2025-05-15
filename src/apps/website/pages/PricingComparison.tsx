// src/apps/website/components/PricingComparison.tsx
import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

interface PricingComparisonProps {
  regularPrice: number;
  premiumPrice: number;
  isPremium: boolean;
}

const PricingComparison: React.FC<PricingComparisonProps> = ({ 
  regularPrice,
  premiumPrice,
  isPremium
}) => {
  const discount = ((regularPrice - premiumPrice) / regularPrice) * 100;
  
  return (
    <Card className="mb-4 border-primary">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Comparación de Precios</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6} className="border-end">
            <div className="text-center mb-3">
              <h6>Precio Regular</h6>
              <h3>${regularPrice}</h3>
            </div>
          </Col>
          <Col md={6}>
            <div className="text-center mb-3">
              <h6>
                Precio Premium 
                <Badge bg="warning" text="dark" className="ms-2">
                  {discount.toFixed(0)}% OFF
                </Badge>
              </h6>
              <h3 className="text-primary">${premiumPrice}</h3>
            </div>
          </Col>
        </Row>
        {!isPremium && (
          <div className="text-center mt-3">
            <p className="mb-1">Haciéndote premium ahorrarías:</p>
            <h4 className="text-success">${(regularPrice - premiumPrice).toFixed(2)}</h4>
            <a href="/subscription" className="btn btn-sm btn-warning mt-2">
              <i className="bi bi-star-fill me-2"></i>
              Hazte Premium
            </a>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PricingComparison;