// src/apps/pos/pages/POSSeatSelection.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import SeatMap from '../../../common/components/SeatMap';

interface ShowDetails {
    id: string;
    movieId: string;
    movieTitle: string;
    roomId: string;
    roomName: string;
    startTime: string;
    endTime: string;
    is3d: boolean;
    isSubtitled: boolean;
}

interface TicketType {
    id: string;
    name: string;
    price: number;
}

interface SeatData {
    id: string;
    row: string;
    number: string;
    type: 'standard' | 'vip' | 'premium' | 'accessible';
    status: 'available' | 'selected' | 'occupied' | 'disabled';
}

const POSSeatSelection: React.FC = () => {
    const { showId } = useParams<{ showId: string }>();
    const navigate = useNavigate();

    const [show, setShow] = useState<ShowDetails | null>(null);
    const [seats, setSeats] = useState<SeatData[]>([]);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [selectedTicketTypes, setSelectedTicketTypes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulación de carga de datos
        const fetchData = async () => {
            try {
                // Simular datos del show
                const showData: ShowDetails = {
                    id: showId || '1',
                    movieId: '1',
                    movieTitle: 'Minecraft',
                    roomId: '1',
                    roomName: 'Sala 1',
                    startTime: '2025-05-04T14:30:00',
                    endTime: '2025-05-04T16:38:00',
                    is3d: false,
                    isSubtitled: false
                };

                // Simular datos de asientos
                const seatsData: SeatData[] = [];
                const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
                const seatsPerRow = 15;

                rows.forEach(row => {
                    for (let i = 1; i <= seatsPerRow; i++) {
                        const seatId = `${row}${i}`;
                        let type: 'standard' | 'vip' | 'premium' | 'accessible' = 'standard';

                        // Asignar tipos de asiento
                        if (['A', 'B', 'C'].includes(row)) {
                            type = 'standard';
                        } else if (['D', 'E', 'F'].includes(row)) {
                            type = 'vip';
                        } else {
                            type = 'premium';
                        }

                        // Algunos asientos accesibles
                        if ((row === 'D' && (i === 1 || i === 15)) || (row === 'E' && (i === 1 || i === 15))) {
                            type = 'accessible';
                        }

                        // Algunos asientos ocupados (simulación)
                        const status = Math.random() < 0.2 ? 'occupied' : 'available';

                        seatsData.push({
                            id: seatId,
                            row,
                            number: i.toString(),
                            type,
                            status
                        });
                    }
                });

                // Simular tipos de entradas
                const ticketTypesData: TicketType[] = [
                    { id: '1', name: 'Adulto', price: 950 },
                    { id: '2', name: 'Niño', price: 650 },
                    { id: '3', name: 'Jubilado', price: 550 },
                    { id: '4', name: 'Estudiante', price: 750 }
                ];

                setShow(showData);
                setSeats(seatsData);
                setTicketTypes(ticketTypesData);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos. Por favor, intente nuevamente.');
                setLoading(false);
            }
        };

        fetchData();
    }, [showId]);

    const handleSeatClick = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            // Deseleccionar asiento
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));

            // Eliminar el tipo de entrada asignado
            const newSelectedTicketTypes = { ...selectedTicketTypes };
            delete newSelectedTicketTypes[seatId];
            setSelectedTicketTypes(newSelectedTicketTypes);
            // src/apps/pos/pages/POSSeatSelection.tsx (continuación)
        } else {
            // Seleccionar asiento
            setSelectedSeats([...selectedSeats, seatId]);

            // Asignar automáticamente el primer tipo de entrada
            setSelectedTicketTypes({
                ...selectedTicketTypes,
                [seatId]: ticketTypes[0]?.id || ''
            });
        }
    };

    const handleTicketTypeChange = (seatId: string, ticketTypeId: string) => {
        setSelectedTicketTypes({
            ...selectedTicketTypes,
            [seatId]: ticketTypeId
        });
    };

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seatId) => {
            const ticketTypeId = selectedTicketTypes[seatId];
            const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
            return total + (ticketType?.price || 0);
        }, 0);
    };

    const handleContinue = () => {
        // Aquí guardaríamos la selección y continuaríamos al siguiente paso
        navigate('/pos/products');
    };

    const formatDateTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h1 className="mb-4">Selección de Asientos</h1>

            {show && (
                <Card className="mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <h5>{show.movieTitle}</h5>
                                <p className="mb-1">
                                    <strong>Sala:</strong> {show.roomName}
                                </p>
                                <p className="mb-1">
                                    <strong>Función:</strong> {formatDateTime(show.startTime)}
                                </p>
                                <p className="mb-0">
                                    {show.is3d && <span className="badge bg-info me-2">3D</span>}
                                    {show.isSubtitled && <span className="badge bg-secondary me-2">Subtitulada</span>}
                                </p>
                            </Col>
                            <Col md={6} className="text-md-end">
                                <div className="selected-count">
                                    <h5>Asientos Seleccionados: {selectedSeats.length}</h5>
                                    <p className="mb-0">
                                        {selectedSeats.length > 0 ? (
                                            <span>{selectedSeats.join(', ')}</span>
                                        ) : (
                                            <span className="text-muted">Ninguno seleccionado</span>
                                        )}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            <Row>
                <Col lg={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="mb-3">Seleccione los asientos</h5>
                            <SeatMap
                                seats={seats}
                                selectedSeats={selectedSeats}
                                onSeatClick={handleSeatClick}
                                showLegend={true}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Detalle de Entradas</h5>
                        </Card.Header>
                        <Card.Body>
                            {selectedSeats.length === 0 ? (
                                <p className="text-center text-muted">
                                    Seleccione al menos un asiento para continuar
                                </p>
                            ) : (
                                <>
                                    {selectedSeats.map(seatId => {
                                        const seat = seats.find(s => s.id === seatId);
                                        return (
                                            <div key={seatId} className="mb-3 p-2 border rounded">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <strong>Asiento {seatId}</strong>
                                                    <span>
                                                        {seat?.type === 'standard' && 'Estándar'}
                                                        {seat?.type === 'vip' && 'VIP'}
                                                        {seat?.type === 'premium' && 'Premium'}
                                                        {seat?.type === 'accessible' && 'Accesible'}
                                                    </span>
                                                </div>
                                                <Form.Group>
                                                    <Form.Label>Tipo de Entrada</Form.Label>
                                                    <Form.Select
                                                        value={selectedTicketTypes[seatId] || ''}
                                                        onChange={(e) => handleTicketTypeChange(seatId, e.target.value)}
                                                    >
                                                        {ticketTypes.map(type => (
                                                            <option key={type.id} value={type.id}>
                                                                {type.name} - ${type.price}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                        );
                                    })}

                                    <hr />

                                    <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                                        <span>Total:</span>
                                        <span>${calculateTotal().toLocaleString('es-AR')}</span>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-100"
                                        onClick={handleContinue}
                                        disabled={selectedSeats.length === 0}
                                    >
                                        Continuar
                                    </Button>
                                </>
                            )}
                        </Card.Body>
                    </Card>

                    <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={() => navigate('/pos')}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Volver a Funciones
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default POSSeatSelection;