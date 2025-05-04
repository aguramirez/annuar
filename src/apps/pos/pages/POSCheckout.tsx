// src/apps/pos/pages/POSCheckout.tsx
import React, { useState } from 'react';
import { Container, Card, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const POSCheckout: React.FC = () => {
    const navigate = useNavigate();

    // Simulación de datos de una orden
    const [order, setOrder] = useState({
        ticketItems: [
            { id: '1', type: 'Adulto', seat: 'D5', price: 950 },
            { id: '2', type: 'Niño', seat: 'D6', price: 650 }
        ],
        productItems: [
            { id: '1', name: 'Gaseosa Grande', quantity: 2, price: 300 },
            { id: '2', name: 'Popcorn Grande', quantity: 1, price: 450 }
        ],
        movie: 'Minecraft',
        showtime: '04/05/2025 14:30',
        room: 'Sala 1',
        subtotal: 2650,
        tax: 556.5,
        total: 3206.5
    });

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cashReceived, setCashReceived] = useState(order.total.toString());
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateChange = () => {
        const received = parseFloat(cashReceived);
        if (isNaN(received)) return 0;
        return Math.max(0, received - order.total);
    };

    const handleProcessPayment = () => {
        setError(null);

        // Validar datos según el método de pago
        if (paymentMethod === 'cash') {
            const received = parseFloat(cashReceived);
            if (isNaN(received) || received < order.total) {
                setError('El monto recibido debe ser igual o mayor al total.');
                return;
            }
        }

        // Simular procesamiento de pago
        setProcessingPayment(true);

        setTimeout(() => {
            setProcessingPayment(false);
            setPaymentComplete(true);
        }, 1500);
    };

    const handleNewSale = () => {
        navigate('/pos');
    };

    const handlePrintTickets = () => {
        // Simular impresión de tickets
        window.alert('Imprimiendo tickets...');
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4">Finalizar Compra</h1>

            {paymentComplete ? (
                <Card className="mb-4 text-center">
                    <Card.Body className="p-5">
                        <div className="mb-4">
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h2 className="mb-3">¡Pago Completado!</h2>
                        <p className="mb-4">La venta se ha procesado correctamente.</p>

                        <div className="d-flex justify-content-center gap-3">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handlePrintTickets}
                            >
                                <i className="bi bi-printer me-2"></i>
                                Imprimir Tickets
                            </Button>

                            <Button
                                variant="success"
                                size="lg"
                                onClick={handleNewSale}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Nueva Venta
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <Row>
                    <Col lg={7}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Detalle de la Orden</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="order-movie-info mb-3">
                                    <h5>{order.movie}</h5>
                                    <p className="mb-1">
                                        <strong>Función:</strong> {order.showtime}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Sala:</strong> {order.room}
                                    </p>
                                </div>

                                <h6 className="border-bottom pb-2 mb-3">Entradas</h6>
                                {order.ticketItems.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-2">
                                        <span>{item.type} - Asiento {item.seat}</span>
                                        <span>${item.price.toLocaleString('es-AR')}</span>
                                    </div>
                                ))}

                                <h6 className="border-bottom pb-2 mb-3 mt-4">Productos</h6>
                                {order.productItems.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-2">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                                    </div>
                                ))}

                                <hr className="my-4" />

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>${order.subtotal.toLocaleString('es-AR')}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>IVA (21%):</span>
                                    <span>${order.tax.toLocaleString('es-AR')}</span>
                                </div>

                                <div className="d-flex justify-content-between fs-5 fw-bold mt-2">
                                    <span>Total:</span>
                                    <span>${order.total.toLocaleString('es-AR')}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={5}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Método de Pago</h5>
                            </Card.Header>
                            <Card.Body>
                                {error && (
                                    <Alert variant="danger" className="mb-3">
                                        {error}
                                    </Alert>
                                )}

                                <Form>
                                    <Form.Group className="mb-4">
                                        <div className="d-flex gap-3">
                                            <Form.Check
                                                type="radio"
                                                id="pay-cash"
                                                name="paymentMethod"
                                                label="Efectivo"
                                                checked={paymentMethod === 'cash'}
                                                onChange={() => setPaymentMethod('cash')}
                                                className="payment-option"
                                            />
                                            <Form.Check
                                                type="radio"
                                                id="pay-card"
                                                name="paymentMethod"
                                                label="Tarjeta"
                                                checked={paymentMethod === 'card'}
                                                onChange={() => setPaymentMethod('card')}
                                                className="payment-option"
                                            />
                                            <Form.Check
                                                type="radio"
                                                id="pay-mp"
                                                name="paymentMethod"
                                                label="MercadoPago"
                                                checked={paymentMethod === 'mp'}
                                                onChange={() => setPaymentMethod('mp')}
                                                className="payment-option"
                                            />
                                        </div>
                                    </Form.Group>

                                    {paymentMethod === 'cash' && (
                                        <div className="cash-payment mb-4">
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Monto Recibido ($)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            value={cashReceived}
                                                            onChange={(e) => setCashReceived(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Cambio ($)</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={calculateChange().toLocaleString('es-AR')}
                                                            disabled
                                                            className="bg-light"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}

                  // src/apps/pos/pages/POSCheckout.tsx (continuación)
                                    {paymentMethod === 'card' && (
                                        <div className="card-payment mb-4">
                                            <div className="text-center p-4 border rounded mb-3">
                                                <h6 className="mb-3">Terminal de Pago</h6>
                                                <p className="mb-3">Entregue la terminal al cliente para que realice el pago.</p>
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Procesando...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'mp' && (
                                        <div className="mp-payment mb-4">
                                            <div className="text-center p-4 border rounded mb-3">
                                                <h6 className="mb-3">Código QR de MercadoPago</h6>
                                                <div className="qr-placeholder mb-3">
                                                    <img
                                                        src="https://via.placeholder.com/200"
                                                        alt="QR de MercadoPago"
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <p className="mb-0">El cliente debe escanear el código QR y realizar el pago.</p>
                                            </div>
                                        </div>
                                    )}

                                    <hr className="my-4" />

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre del Cliente (opcional)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre y apellido"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Email del Cliente (opcional)</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="ejemplo@email.com"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                        />
                                        <Form.Text className="text-muted">
                                            Si se proporciona, se enviará un recibo por email.
                                        </Form.Text>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-100"
                                        onClick={handleProcessPayment}
                                        disabled={processingPayment}
                                    >
                                        {processingPayment ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>Procesar Pago</>
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Button
                            variant="outline-secondary"
                            className="w-100"
                            onClick={() => navigate('/pos/products')}
                            disabled={processingPayment}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Volver a Productos
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default POSCheckout;