// src/apps/validator/pages/ValidatorSettings.tsx
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Show {
    id: string;
    movieTitle: string;
    roomName: string;
    startTime: string;
    endTime: string;
}

const ValidatorSettings: React.FC = () => {
    const navigate = useNavigate();

    const [activeShow, setActiveShow] = useState<string>('');
    const [mode, setMode] = useState<'online' | 'offline'>('online');
    const [vibration, setVibration] = useState<boolean>(true);
    const [sound, setSound] = useState<boolean>(true);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    // Simulación de funciones activas
    const [shows, setShows] = useState<Show[]>([
        {
            id: '1',
            movieTitle: 'Minecraft',
            roomName: 'Sala 1',
            startTime: '2025-05-04T14:30:00',
            endTime: '2025-05-04T16:38:00'
        },
        {
            id: '2',
            movieTitle: 'Capitan America: Un Nuevo Mundo',
            roomName: 'Sala 2',
            startTime: '2025-05-04T15:30:00',
            endTime: '2025-05-04T17:25:00'
        },
        {
            id: '3',
            movieTitle: 'Blanca Nieves',
            roomName: 'Sala 3',
            startTime: '2025-05-04T16:00:00',
            endTime: '2025-05-04T18:12:00'
        }
    ]);

    const formatDateTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSave = () => {
        // Simular guardado de configuración
        setShowSuccess(true);

        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Configuración del Validador</h1>
                <Button
                    variant="outline-primary"
                    onClick={() => navigate('/validator')}
                >
                    <i className="bi bi-qr-code-scan me-2"></i>
                    Ir al Escáner
                </Button>
            </div>

            {showSuccess && (
                <Alert variant="success" className="mb-4">
                    Configuración guardada correctamente.
                </Alert>
            )}

            <Row>
                <Col lg={6} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Función Activa</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-4">
                                <Form.Label>Seleccione la función para validar</Form.Label>
                                <Form.Select
                                    value={activeShow}
                                    onChange={(e) => setActiveShow(e.target.value)}
                                >
                                    <option value="">Seleccionar función...</option>
                                    {shows.map(show => (
                                        <option key={show.id} value={show.id}>
                                            {show.movieTitle} - {show.roomName} - {formatDateTime(show.startTime)}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    Seleccione la función para la que estará validando entradas.
                                </Form.Text>
                            </Form.Group>

                            {activeShow && (
                                <div className="selected-show p-3 bg-light rounded mb-3">
                                    <h6 className="mb-2">Función Seleccionada:</h6>
                                    {(() => {
                                        const show = shows.find(s => s.id === activeShow);
                                        return show ? (
                                            <div>
                                                <p className="mb-1">
                                                    <strong>Película:</strong> {show.movieTitle}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Sala:</strong> {show.roomName}
                                                </p>
                                                <p className="mb-0">
                                                    <strong>Horario:</strong> {formatDateTime(show.startTime)} a {formatDateTime(show.endTime)}
                                                </p>
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                            )}

                            <Button
                                variant="primary"
                                className="w-100"
                                disabled={!activeShow}
                                onClick={handleSave}
                            >
                                <i className="bi bi-check-lg me-2"></i>
                                Activar Validación para esta Función
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="mb-4">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Preferencias</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-4">
                                <Form.Label>Modo de Operación</Form.Label>
                                <div>
                                    <Form.Check
                                        type="radio"
                                        id="mode-online"
                                        name="mode"
                                        label="Online (requiere conexión a internet)"
                                        checked={mode === 'online'}
                                        onChange={() => setMode('online')}
                                        className="mb-2"
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="mode-offline"
                                        name="mode"
                                        label="Offline (validación local)"
                                        checked={mode === 'offline'}
                                        onChange={() => setMode('offline')}
                                    />
                                </div>
                                <Form.Text className="text-muted">
                                    En modo offline, debe descargar la lista de entradas para validación local.
                                </Form.Text>
                            </Form.Group>

                            {mode === 'offline' && (
                                <div className="mb-4">
                                    <Button variant="outline-primary" className="w-100">
                                        <i className="bi bi-download me-2"></i>
                                        Descargar Datos para Validación Offline
                                    </Button>
                                </div>
                            )}

                            <h6 className="mb-3">Notificaciones</h6>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="switch"
                                    id="vibration"
                                    label="Vibración al escanear"
                                    checked={vibration}
                                    onChange={(e) => setVibration(e.target.checked)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Check
                                    type="switch"
                                    id="sound"
                                    label="Sonido al escanear"
                                    checked={sound}
                                    onChange={(e) => setSound(e.target.checked)}
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                className="w-100"
                                onClick={handleSave}
                            >
                                <i className="bi bi-save me-2"></i>
                                Guardar Configuración
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ValidatorSettings;