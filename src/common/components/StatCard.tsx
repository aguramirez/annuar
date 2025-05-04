// src/common/components/StatCard.tsx
import React from 'react';
import { Card } from 'react-bootstrap';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  percentage,
  trend
}) => {
  return (
    <Card className="stat-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className={`stat-icon-container bg-${color} bg-opacity-10`}>
            <i className={`bi ${icon} text-${color}`}></i>
          </div>
          {trend && percentage && (
            <div className={`trend-badge ${trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral'}`}>
              <i className={`bi ${trend === 'up' ? 'bi-arrow-up' : trend === 'down' ? 'bi-arrow-down' : 'bi-dash'}`}></i>
              {percentage}%
            </div>
          )}
        </div>
        <h3 className="stat-value mb-1">{value}</h3>
        <div className="stat-title">{title}</div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;