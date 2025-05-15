import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert } from 'react-bootstrap';
import { mockEmployeeSalesData } from '../../../data/mockData';

interface EmployeeVariance {
  type: string;
  amount: number;
  reason: string;
}

interface DailySalesData {
  date: string;
  ticketSales: number;
  candySales: number;
  totalSales: number;
  transactions: number;
  averageTransaction: number;
  expectedCash: number;
  reportedCash: number;
  variance: number;
  variances: EmployeeVariance[];
}

interface Employee {
  id: number;
  name: string;
  position: string;
  salesData: DailySalesData[];
  totalSales: number;
  averageVariance: number;
  isFlagged?: boolean;
}

const EmployeeSalesMetrics: React.FC = () => {
  const [employees] = useState<Employee[]>(mockEmployeeSalesData);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dateRange, setDateRange] = useState({
    start: '2025-05-01',
    end: '2025-05-05'
  });
  
  // Filter function to filter employees with suspicious patterns
  const flaggedEmployees = employees.filter(emp => emp.averageVariance < -200 || emp.isFlagged);
  
  // Handle employee selection
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('es-AR')}`;
  };
  
  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h2 className="mb-3">Métricas de Ventas por Empleado</h2>
        <p className="text-muted">
          Monitorea las ventas y discrepancias en efectivo por empleado para detectar posibles problemas.
        </p>
        
        {/* Alert for flagged employees */}
        {flaggedEmployees.length > 0 && (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Atención:</strong> {flaggedEmployees.length} empleado(s) con patrones de discrepancia detectados.
          </Alert>
        )}
      </div>
      
      {/* Date range filter */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Inicio:</Form.Label>
                <Form.Control 
                  type="date" 
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Fin:</Form.Label>
                <Form.Control 
                  type="date" 
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Button variant="primary" className="mt-md-0 mt-3">
                <i className="bi bi-search me-2"></i>
                Aplicar Filtros
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Employees summary table */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Resumen de Empleados</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Cargo</th>
                  <th className="text-end">Ventas Totales</th>
                  <th className="text-end">Varianza Promedio</th>
                  <th className="text-center">Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id} className={employee.averageVariance < -200 ? 'table-warning' : ''}>
                    <td>{employee.name}</td>
                    <td>{employee.position}</td>
                    <td className="text-end">{formatCurrency(employee.totalSales)}</td>
                    <td className={`text-end ${employee.averageVariance < 0 ? 'text-danger' : employee.averageVariance > 0 ? 'text-success' : ''}`}>
                      {employee.averageVariance < 0 ? '-' : '+'}
                      {formatCurrency(Math.abs(employee.averageVariance))}
                    </td>
                    <td className="text-center">
                      {employee.averageVariance < -200 ? (
                        <Badge bg="danger">Alerta</Badge>
                      ) : employee.averageVariance < 0 ? (
                        <Badge bg="warning" text="dark">Revisar</Badge>
                      ) : (
                        <Badge bg="success">Normal</Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleSelectEmployee(employee)}
                      >
                        <i className="bi bi-graph-up me-1"></i>
                        Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {/* Selected employee details */}
      {selectedEmployee && (
        <Card>
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Detalles de {selectedEmployee.name}</h5>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setSelectedEmployee(null)}
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th className="text-end">Ventas Entradas</th>
                    <th className="text-end">Ventas Candy</th>
                    <th className="text-end">Ventas Totales</th>
                    <th className="text-end">Transacciones</th>
                    <th className="text-end">Prom. por Trans.</th>
                    <th className="text-end">Efectivo Esperado</th>
                    <th className="text-end">Efectivo Reportado</th>
                    <th className="text-end">Varianza</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee.salesData.map((day, index) => (
                    <tr key={index} className={day.variance < 0 ? 'table-warning' : ''}>
                      <td>{new Date(day.date).toLocaleDateString('es-AR')}</td>
                      <td className="text-end">{formatCurrency(day.ticketSales)}</td>
                      <td className="text-end">{formatCurrency(day.candySales)}</td>
                      <td className="text-end">{formatCurrency(day.totalSales)}</td>
                      <td className="text-end">{day.transactions}</td>
                      <td className="text-end">{formatCurrency(day.averageTransaction)}</td>
                      <td className="text-end">{formatCurrency(day.expectedCash)}</td>
                      <td className="text-end">{formatCurrency(day.reportedCash)}</td>
                      <td className={`text-end ${day.variance < 0 ? 'text-danger' : day.variance > 0 ? 'text-success' : ''}`}>
                        {day.variance === 0 ? '-' : (
                          day.variance < 0 ? '-' : '+'
                        )}{day.variance !== 0 ? formatCurrency(Math.abs(day.variance)) : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
      
      {/* Detailed variance report for the selected employee */}
      {selectedEmployee && selectedEmployee.salesData.some(day => day.variances.length > 0) && (
        <Card className="mt-4">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Reporte de Discrepancias</h5>
          </Card.Header>
          <Card.Body>
            <Table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th className="text-end">Monto</th>
                  <th>Razón</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {selectedEmployee.salesData
                  .flatMap(day => 
                    day.variances.map((variance, vIndex) => ({
                      date: day.date,
                      ...variance,
                      id: `${day.date}-${vIndex}`
                    }))
                  )
                  .map(variance => (
                    <tr key={variance.id}>
                      <td>{new Date(variance.date).toLocaleDateString('es-AR')}</td>
                      <td>{variance.type}</td>
                      <td className="text-end text-danger">-{formatCurrency(Math.abs(variance.amount))}</td>
                      <td>{variance.reason}</td>
                      <td>
                        {variance.reason === "Pendiente de investigación" ? (
                          <Badge bg="warning" text="dark">Pendiente</Badge>
                        ) : (
                          <Badge bg="info">Registrado</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            
            {selectedEmployee.isFlagged && (
              <Alert variant="danger" className="mt-3">
                <div className="d-flex">
                  <div className="me-3">
                    <i className="bi bi-exclamation-octagon-fill fs-3"></i>
                  </div>
                  <div>
                    <h5>¡Alerta de Patrón Sospechoso!</h5>
                    <p className="mb-1">Este empleado presenta un patrón recurrente de discrepancias negativas del mismo monto.</p>
                    <p className="mb-0">Se recomienda una investigación detallada y posiblemente una revisión de las grabaciones de seguridad.</p>
                  </div>
                </div>
              </Alert>
            )}
            
            <div className="mt-3">
              <Button variant="outline-primary" className="me-2">
                <i className="bi bi-printer me-1"></i>
                Imprimir Reporte
              </Button>
              <Button variant="outline-secondary">
                <i className="bi bi-file-earmark-excel me-1"></i>
                Exportar a Excel
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default EmployeeSalesMetrics;