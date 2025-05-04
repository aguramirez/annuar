// src/apps/admin/pages/ReportingSales.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

interface SalesData {
    date: string;
    totalSales: number;
    ticketSales: number;
    productSales: number;
    transactions: number;
}

interface MovieSalesData {
    id: string;
    title: string;
    sales: number;
    tickets: number;
    occupancyRate: number;
}

interface ProductSalesData {
    id: string;
    name: string;
    category: string;
    quantity: number;
    sales: number;
}

interface HourlyData {
    hour: string;
    value: number;
}

const ReportingSales: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState<{ start: string, end: string }>({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    // Datos simulados
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [movieSalesData, setMovieSalesData] = useState<MovieSalesData[]>([]);
    const [productSalesData, setProductSalesData] = useState<ProductSalesData[]>([]);
    const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);

    // Totales
    const [totals, setTotals] = useState({
        totalSales: 0,
        ticketSales: 0,
        productSales: 0,
        transactions: 0,
        averageTicket: 0,
        conversionRate: 0
    });

    useEffect(() => {
        // Simulación de carga de datos
        const fetchData = async () => {
            // Generar datos simulados para ventas por día
            const days = 30;
            const dailySales: SalesData[] = [];

            for (let i = 0; i < days; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (days - i - 1));

                const ticketSales = Math.floor(Math.random() * 50000) + 10000;
                const productSales = Math.floor(Math.random() * 30000) + 5000;

                dailySales.push({
                    date: date.toISOString().split('T')[0],
                    totalSales: ticketSales + productSales,
                    ticketSales,
                    productSales,
                    transactions: Math.floor(Math.random() * 100) + 50
                });
            }

            // Datos de ventas por película
            const movieSales: MovieSalesData[] = [
                { id: '1', title: 'Minecraft', sales: 120000, tickets: 350, occupancyRate: 85 },
                { id: '2', title: 'Capitan America: Un Nuevo Mundo', sales: 180000, tickets: 450, occupancyRate: 92 },
                { id: '3', title: 'Blanca Nieves', sales: 90000, tickets: 280, occupancyRate: 70 },
                { id: '4', title: 'Guardianes del Tiempo', sales: 150000, tickets: 380, occupancyRate: 78 },
                { id: '5', title: 'Susurros del Pasado', sales: 70000, tickets: 200, occupancyRate: 65 },
            ];

            // Datos de ventas por producto
            const productSales: ProductSalesData[] = [
                { id: '1', name: 'Popcorn Grande', category: 'Snacks', quantity: 580, sales: 290000 },
                { id: '2', name: 'Gaseosa Grande', category: 'Bebidas', quantity: 720, sales: 216000 },
                { id: '3', name: 'Combo Familiar', category: 'Combos', quantity: 320, sales: 304000 },
                { id: '4', name: 'Nachos', category: 'Snacks', quantity: 280, sales: 112000 },
                { id: '5', name: 'Agua Mineral', category: 'Bebidas', quantity: 420, sales: 84000 },
            ];

            // Datos por hora
            const hourly: HourlyData[] = [
                { hour: '12:00', value: 30 },
                { hour: '13:00', value: 42 },
                { hour: '14:00', value: 65 },
                { hour: '15:00', value: 78 },
                { hour: '16:00', value: 95 },
                { hour: '17:00', value: 110 },
                { hour: '18:00', value: 135 },
                { hour: '19:00', value: 162 },
                { hour: '20:00', value: 178 },
                { hour: '21:00', value: 143 },
                { hour: '22:00', value: 98 },
                { hour: '23:00', value: 65 },
            ];

            // Calcular totales
            const totalSalesSum = dailySales.reduce((sum, day) => sum + day.totalSales, 0);
            const ticketSalesSum = dailySales.reduce((sum, day) => sum + day.ticketSales, 0);
            const productSalesSum = dailySales.reduce((sum, day) => sum + day.productSales, 0);
            const transactionsSum = dailySales.reduce((sum, day) => sum + day.transactions, 0);

            setSalesData(dailySales);
            setMovieSalesData(movieSales);
            setProductSalesData(productSales);
            setHourlyData(hourly);

            setTotals({
                totalSales: totalSalesSum,
                ticketSales: ticketSalesSum,
                productSales: productSalesSum,
                transactions: transactionsSum,
                averageTicket: Math.round(totalSalesSum / transactionsSum),
                conversionRate: 78.5
            });

            setLoading(false);
        };

        fetchData();
    }, [dateRange]);

    // Colores para gráficos
    const colors = ['#FF4563', '#3D5AFE', '#00C853', '#FFC107', '#8E24AA'];

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
            <h1 className="mb-4">Reportes y Estadísticas</h1>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={6} lg={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de reporte</Form.Label>
                                <Form.Select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                >
                                    <option value="sales">Ventas y Facturación</option>
                                    <option value="movies">Películas</option>
                                    <option value="products">Productos</option>
                                    <option value="attendance">Asistencia</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha Fin</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={2} className="d-flex align-items-end">
                            <Button variant="primary" className="w-100 mb-3">
                                <i className="bi bi-search me-2"></i>
                                Aplicar Filtros
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* KPI Cards */}
            <Row className="mb-4">
                <Col md={4} xl={2} className="mb-3">
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">Ventas Totales</h6>
                            <h3 className="mb-0">${totals.totalSales.toLocaleString('es-AR')}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} xl={2} className="mb-3">
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">Entradas</h6>
                            <h3 className="mb-0">${totals.ticketSales.toLocaleString('es-AR')}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} xl={2} className="mb-3">
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">Alimentos</h6>
                            <h3 className="mb-0">${totals.productSales.toLocaleString('es-AR')}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} xl={2} className="mb-3">
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">Transacciones</h6>
                            <h3 className="mb-0">{totals.transactions}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} xl={2} className="mb-3">
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">Ticket Promedio</h6>
                            <h3 className="mb-0">${totals.averageTicket.toLocaleString('es-AR')}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} xl={2} className="mb-3">
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">Conversión</h6>
                            <h3 className="mb-0">{totals.conversionRate}%</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="sales" className="mb-4">
                <Tab eventKey="sales" title="Ventas por Día">
                    <Card>
                        <Card.Body>
                            <h5 className="mb-4">Tendencia de Ventas Diarias</h5>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString('es-AR')}`, 'Ventas']} />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalSales" name="Ventas Totales" stroke="#FF4563" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="ticketSales" name="Entradas" stroke="#3D5AFE" />
                                    <Line type="monotone" dataKey="productSales" name="Productos" stroke="#00C853" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="movies" title="Películas">
                    <Row>
                        <Col lg={6}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <h5 className="mb-4">Ventas por Película</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={movieSalesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="title" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString('es-AR')}`, 'Ventas']} />
                                            <Bar dataKey="sales" name="Ventas" fill="#FF4563">
                                                {movieSalesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={6}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <h5 className="mb-4">Ocupación por Película</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={movieSalesData}
                                                dataKey="tickets"
                                                nameKey="title"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label={({ title, percent }) => `${title}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {movieSalesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${Number(value)} entradas`, 'Ventas']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card>
                        <Card.Body>
                            <h5 className="mb-4">Detalle por Película</h5>
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>Película</th>
                                        <th className="text-end">Entradas</th>
                                        <th className="text-end">Ventas</th>
                                        <th className="text-end">Ocupación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movieSalesData.map((movie) => (
                                        <tr key={movie.id}>
                                            <td>{movie.title}</td>
                                            <td className="text-end">{movie.tickets}</td>
                      // src/apps/admin/pages/ReportingSales.tsx (continuación)
                                            <td className="text-end">${movie.sales.toLocaleString('es-AR')}</td>
                                            <td className="text-end">{movie.occupancyRate}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="fw-bold">
                                        <td>Total</td>
                                        <td className="text-end">{movieSalesData.reduce((sum, movie) => sum + movie.tickets, 0)}</td>
                                        <td className="text-end">
                                            ${movieSalesData.reduce((sum, movie) => sum + movie.sales, 0).toLocaleString('es-AR')}
                                        </td>
                                        <td className="text-end">
                                            {Math.round(movieSalesData.reduce((sum, movie) => sum + movie.occupancyRate, 0) / movieSalesData.length)}%
                                        </td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="products" title="Productos">
                    <Row>
                        <Col lg={6}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <h5 className="mb-4">Ventas por Producto</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={productSalesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString('es-AR')}`, 'Ventas']} />
                                            <Bar dataKey="sales" name="Ventas" fill="#3D5AFE">
                                                {productSalesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={6}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <h5 className="mb-4">Cantidad Vendida por Producto</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={productSalesData}
                                                dataKey="quantity"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {productSalesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${Number(value)} unidades`, 'Cantidad']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card>
                        <Card.Body>
                            <h5 className="mb-4">Detalle por Producto</h5>
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th className="text-end">Cantidad</th>
                                        <th className="text-end">Ventas</th>
                                        <th className="text-end">Precio Promedio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productSalesData.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td className="text-end">{product.quantity}</td>
                                            <td className="text-end">${product.sales.toLocaleString('es-AR')}</td>
                                            <td className="text-end">${Math.round(product.sales / product.quantity).toLocaleString('es-AR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="fw-bold">
                                        <td colSpan={2}>Total</td>
                                        <td className="text-end">{productSalesData.reduce((sum, product) => sum + product.quantity, 0)}</td>
                                        <td className="text-end">
                                            ${productSalesData.reduce((sum, product) => sum + product.sales, 0).toLocaleString('es-AR')}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="attendance" title="Asistencia">
                    <Card>
                        <Card.Body>
                            <h5 className="mb-4">Distribución de Asistencia por Hora</h5>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={hourlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${Number(value)} espectadores`, 'Asistencia']} />
                                    <Bar dataKey="value" name="Espectadores" fill="#00C853">
                                        {hourlyData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.value > 100 ? '#FF4563' : entry.value > 70 ? '#FFC107' : '#00C853'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            <div className="d-flex justify-content-end mt-4">
                <Button variant="success" className="me-2">
                    <i className="bi bi-file-excel me-2"></i>
                    Exportar a Excel
                </Button>
                <Button variant="primary">
                    <i className="bi bi-filetype-pdf me-2"></i>
                    Exportar a PDF
                </Button>
            </div>
        </Container>
    );
};

export default ReportingSales;