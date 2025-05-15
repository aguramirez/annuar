// src/apps/admin/pages/ShowManagement.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Table, Badge } from 'react-bootstrap';
import DataTable from '../../../common/components/DataTable';

interface Show {
  id: string;
  movieId: string;
  movieTitle: string;
  roomId: string;
  roomName: string;
  startTime: string;
  endTime: string;
  is3d: boolean;
  isSubtitled: boolean;
  language: string;
  status: string;
}

interface Movie {
  id: string;
  title: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
}

const ShowManagement: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentShow, setCurrentShow] = useState<Partial<Show> | null>(null);
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Simular carga de datos
    const fetchData = async () => {
      // Simulación de datos
      const showsData: Show[] = [
        {
          id: '1',
          movieId: '1',
          movieTitle: 'Minecraft',
          roomId: '1',
          roomName: 'Sala 1',
          startTime: '2025-05-04T14:30:00',
          endTime: '2025-05-04T16:38:00',
          is3d: false,
          isSubtitled: false,
          language: 'Español',
          status: 'SCHEDULED'
        },
        {
          id: '2',
          movieId: '1',
          movieTitle: 'Minecraft',
          roomId: '2',
          roomName: 'Sala 2',
          startTime: '2025-05-04T17:45:00',
          endTime: '2025-05-04T19:53:00',
          is3d: true,
          isSubtitled: false,
          language: 'Español',
          status: 'SCHEDULED'
        },
        {
          id: '3',
          movieId: '2',
          movieTitle: 'Capitan America: Un Nuevo Mundo',
          roomId: '1',
          roomName: 'Sala 1',
          startTime: '2025-05-04T20:15:00',
          endTime: '2025-05-04T22:10:00',
          is3d: false,
          isSubtitled: true,
          language: 'Inglés',
          status: 'SCHEDULED'
        },
      ];

      const moviesData: Movie[] = [
        { id: '1', title: 'Minecraft' },
        { id: '2', title: 'Capitan America: Un Nuevo Mundo' },
        { id: '3', title: 'Blanca Nieves' },
      ];

      const roomsData: Room[] = [
        { id: '1', name: 'Sala 1', capacity: 120 },
        { id: '2', name: 'Sala 2', capacity: 80 },
        { id: '3', name: 'Sala 3 (VIP)', capacity: 40 },
      ];

      setShows(showsData);
      setMovies(moviesData);
      setRooms(roomsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddShow = () => {
    setCurrentShow({
      is3d: false,
      isSubtitled: false,
      language: 'Español',
      status: 'SCHEDULED'
    });
    setShowModal(true);
  };

  const handleEditShow = (show: Show) => {
    setCurrentShow({ ...show });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentShow(null);
  };

  const handleSaveShow = () => {
    if (currentShow) {
      if (currentShow.id) {
        // Actualizar función existente
        setShows(shows.map(show => 
          show.id === currentShow.id ? { ...show, ...currentShow } as Show : show
        ));
      } else {
        // Crear nueva función
        const newShow = {
          ...currentShow,
          id: Math.random().toString(36).substr(2, 9),
          movieTitle: movies.find(m => m.id === currentShow.movieId)?.title || '',
          roomName: rooms.find(r => r.id === currentShow.roomId)?.name || '',
        } as Show;
        setShows([...shows, newShow]);
      }
    }
    
    handleCloseModal();
  };

  const handleDeleteShow = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta función?')) {
      setShows(shows.filter(show => show.id !== id));
    }
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

  const filterShows = (show: Show) => {
    const showDate = new Date(show.startTime).toISOString().split('T')[0];
    return showDate === filterDate;
  };

  const filteredShows = shows.filter(filterShows);

  const columns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Película', accessor: 'movieTitle' as const, sortable: true },
    { header: 'Sala', accessor: 'roomName' as const, sortable: true },
    { 
      header: 'Inicio', 
      accessor: (show: Show) => formatDateTime(show.startTime),
      sortable: true
    },
    { 
      header: 'Fin', 
      accessor: (show: Show) => formatDateTime(show.endTime),
      sortable: true
    },
    {
      header: 'Características',
      accessor: (show: Show) => (
        <div>
          {show.is3d && <Badge bg="info" className="me-1">3D</Badge>}
          {show.isSubtitled && <Badge bg="secondary" className="me-1">Subtitulada</Badge>}
          <Badge bg="light" text="dark">{show.language}</Badge>
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: (show: Show) => (
        <Badge bg={show.status === 'SCHEDULED' ? 'success' : show.status === 'CANCELED' ? 'danger' : 'secondary'}>
          {show.status}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      accessor: (show: Show) => (
        <div>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditShow(show)}>
            <i className="bi bi-pencil-square"></i>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteShow(show.id)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      )
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Funciones</h1>
        <Button variant="primary" onClick={handleAddShow}>
          <i className="bi bi-plus-lg me-2"></i>
          Agregar Función
        </Button>
      </div>
      
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Filtrar por fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <DataTable
        columns={columns}
        data={filteredShows}
        keyField="id"
        searchable
        searchPlaceholder="Buscar funciones..."
      />
      
      {/* Modal para agregar/editar función */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentShow?.id ? 'Editar Función' : 'Agregar Función'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Película</Form.Label>
                  <Form.Select 
                    value={currentShow?.movieId || ''}
                    onChange={(e) => setCurrentShow({...currentShow, movieId: e.target.value})}
                  >
                    <option value="">Seleccionar película</option>
                    {movies.map(movie => (
                      <option key={movie.id} value={movie.id}>{movie.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sala</Form.Label>
                  <Form.Select 
                    value={currentShow?.roomId || ''}
                    onChange={(e) => setCurrentShow({...currentShow, roomId: e.target.value})}
                  >
                    <option value="">Seleccionar sala</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>{room.name} ({room.capacity} asientos)</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha y hora de inicio</Form.Label>
                  <Form.Control 
                    type="datetime-local"
                    value={currentShow?.startTime ? new Date(currentShow.startTime).toISOString().substring(0, 16) : ''}
                    onChange={(e) => setCurrentShow({...currentShow, startTime: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha y hora de fin</Form.Label>
                  <Form.Control 
                    type="datetime-local"
                    value={currentShow?.endTime ? new Date(currentShow.endTime).toISOString().substring(0, 16) : ''}
                    onChange={(e) => setCurrentShow({...currentShow, endTime: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Idioma</Form.Label>
                  <Form.Select 
                    value={currentShow?.language || 'Español'}
                    onChange={(e) => setCurrentShow({...currentShow, language: e.target.value})}
                  >
                    <option value="Español">Español</option>
                    <option value="Inglés">Inglés</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox"
                    label="Proyección en 3D"
                    checked={currentShow?.is3d || false}
                    onChange={(e) => setCurrentShow({...currentShow, is3d: e.target.checked})}
                    className="mt-4"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox"
                    label="Subtitulada"
                    checked={currentShow?.isSubtitled || false}
                    onChange={(e) => setCurrentShow({...currentShow, isSubtitled: e.target.checked})}
                    className="mt-4"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select 
                value={currentShow?.status || 'SCHEDULED'}
                onChange={(e) => setCurrentShow({...currentShow, status: e.target.value})}
              >
                <option value="SCHEDULED">Programada</option>
                <option value="CANCELED">Cancelada</option>
                <option value="COMPLETED">Completada</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveShow}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ShowManagement;