// src/apps/admin/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import statsService from '../../../common/services/statsService';

const Dashboard: React.FC = () => {
  const [salesStats, setSalesStats] = useState<any>(null);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fecha actual y hace 30 días
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const cinemaId = '1'; // Esto debería venir de la configuración o contexto

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas de ventas
        const sales = await statsService.getSalesStats(cinemaId, startDate, endDate);
        setSalesStats(sales);
        
        // Obtener estadísticas de asistencia
        const attendance = await statsService.getAttendanceStats(cinemaId, startDate, endDate);
        setAttendanceStats(attendance);
        
        // Obtener top películas
        const movies = await statsService.getTopMoviesStats(cinemaId, startDate, endDate, 5);
        setTopMovies(movies);
        
        // Obtener top productos
        const products = await statsService.getTopProductsStats(cinemaId, startDate, endDate, 5);
        setTopProducts(products);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('No se pudieron cargar los datos del dashboard. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [cinemaId, startDate, endDate]);

  if (loading) {
    return (
      <Container fluid className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    // src/apps/admin/pages/Dashboard.tsx (continuación)
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      
      {/* KPIs */}
      <Row className="mb-4">
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="stat-icon-container bg-primary bg-opacity-10 mb-3">
                <i className="bi bi-cash-stack text-primary"></i>
              </div>
              <h2 className="stat-value">${salesStats?.totalSales.toLocaleString()}</h2>
              <div className="stat-title">Ventas Totales</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="stat-icon-container bg-success bg-opacity-10 mb-3">
                <i className="bi bi-ticket-perforated text-success"></i>
              </div>
              <h2 className="stat-value">${salesStats?.ticketSales.toLocaleString()}</h2>
              <div className="stat-title">Ventas de Entradas</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="stat-icon-container bg-info bg-opacity-10 mb-3">
                <i className="bi bi-cup-straw text-info"></i>
              </div>
              <h2 className="stat-value">${salesStats?.productSales.toLocaleString()}</h2>
              <div className="stat-title">Ventas de Productos</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="stat-icon-container bg-warning bg-opacity-10 mb-3">
                <i className="bi bi-people text-warning"></i>
              </div>
              <h2 className="stat-value">{attendanceStats?.totalAttendance}</h2>
              <div className="stat-title">Asistencia Total</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Gráficos */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Ventas por Día</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesStats?.salesByDay || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ventas']} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" name="Ventas Totales" stroke="#FF4563" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="tickets" name="Entradas" stroke="#3D5AFE" />
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
                <BarChart
                  data={topMovies}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="movieTitle" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Ocupación']} />
                  <Bar dataKey="averageOccupancy" name="Ocupación" fill="#FF4563" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Top Películas</h5>
              <a href="/admin/reports/movies" className="btn btn-sm btn-outline-primary">Ver Todas</a>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Película</th>
                      <th className="text-end">Entradas</th>
                      <th className="text-end">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMovies.map(movie => (
                      <tr key={movie.movieId}>
                        <td>{movie.movieTitle}</td>
                        <td className="text-end">{movie.ticketsSold}</td>
                        <td className="text-end">${movie.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Top Productos</h5>
              <a href="/admin/reports/products" className="btn btn-sm btn-outline-primary">Ver Todos</a>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">Cantidad</th>
                      <th className="text-end">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map(product => (
                      <tr key={product.productId}>
                        <td>{product.productName}</td>
                        <td className="text-end">{product.quantitySold}</td>
                        <td className="text-end">${product.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;