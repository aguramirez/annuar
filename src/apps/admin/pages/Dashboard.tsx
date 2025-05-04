// src/apps/admin/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En un caso real, esto sería una llamada a la API
    const fetchDashboardData = async () => {
      // Simulamos datos para el ejemplo
      const salesByDay = [
        { date: '01/05', sales: 25000, tickets: 320 },
        { date: '02/05', sales: 32000, tickets: 480 },
        { date: '03/05', sales: 28500, tickets: 350 },
        { date: '04/05', sales: 31200, tickets: 410 },
        { date: '05/05', sales: 42000, tickets: 520 },
        { date: '06/05', sales: 35000, tickets: 450 },
        { date: '07/05', sales: 29800, tickets: 380 },
      ];
      
      const occupancyByMovie = [
        { name: 'Capitan America', occupancy: 85 },
        { name: 'Blanca Nieves', occupancy: 73 },
        { name: 'Minecraft', occupancy: 92 },
        { name: 'Mazel Tov', occupancy: 67 },
        { name: 'Guardianes del Tiempo', occupancy: 78 },
      ];

      setSalesData(salesByDay);
      setOccupancyData(occupancyByMovie);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Ventas Totales', value: '$218,500', icon: 'bi-cash-stack', color: 'primary' },
    { title: 'Entradas Vendidas', value: '2,910', icon: 'bi-ticket-perforated', color: 'success' },
    { title: 'Ocupación Promedio', value: '76%', icon: 'bi-people', color: 'info' },
    { title: 'Transacciones', value: '1,453', icon: 'bi-receipt', color: 'warning' },
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
      <h1 className="mb-4">Dashboard</h1>
      
      {/* KPI Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col md={3} sm={6} key={index} className="mb-4">
            <Card className="h-100 dashboard-card">
              <Card.Body className="d-flex align-items-center">
                <div className={`stat-icon bg-${stat.color} bg-opacity-10 me-3`}>
                  <i className={`bi ${stat.icon} text-${stat.color}`}></i>
                </div>
                <div>
                  <h6 className="stat-title mb-1">{stat.title}</h6>
                  <h3 className="stat-value mb-0">{stat.value}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Charts */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Ventas por Día</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="Ventas ($)" stroke="#FF4563" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="tickets" name="Entradas" stroke="#3D5AFE" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Ocupación por Película</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={occupancyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Ocupación']} />
                  <Bar dataKey="occupancy" name="Ocupación" fill="#FF4563" label={{ position: 'right', formatter: (value: any) => `${value}%` }} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Activity Section */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Próximas Funciones</h5>
              <Button variant="outline-primary" size="sm">Ver Todas</Button>
            </Card.Header>
            <Card.Body>
              <div className="upcoming-shows">
                {/* Lista de próximas funciones aquí */}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Últimas Transacciones</h5>
              <Button variant="outline-primary" size="sm">Ver Todas</Button>
            </Card.Header>
            <Card.Body>
              <div className="recent-transactions">
                {/* Lista de transacciones recientes aquí */}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;