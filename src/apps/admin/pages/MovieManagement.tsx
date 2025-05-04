// src/apps/admin/pages/MovieManagement.tsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col, Badge } from 'react-bootstrap';

interface Movie {
  id: number;
  title: string;
  director: string;
  genre: string[];
  duration: number;
  releaseDate: string;
  status: string;
}

const MovieManagement: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Partial<Movie> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // En un caso real, esto sería una llamada a la API
    const fetchMovies = async () => {
      // Datos de ejemplo
      const moviesData = [
        { id: 1, title: 'Minecraft', director: 'María González', genre: ['Drama', 'Ciencia Ficción'], duration: 128, releaseDate: '2024-03-15', status: 'Active' },
        { id: 2, title: 'Capitan America: Un Nuevo Mundo', director: 'Carlos Vidal', genre: ['Thriller', 'Misterio'], duration: 115, releaseDate: '2024-04-05', status: 'Active' },
        { id: 3, title: 'Blanca Nieves', director: 'Laura Sánchez', genre: ['Romance', 'Musical'], duration: 132, releaseDate: '2024-03-22', status: 'Active' },
        { id: 4, title: 'Guardianes del Tiempo', director: 'Roberto Méndez', genre: ['Acción', 'Aventura'], duration: 145, releaseDate: '2024-04-12', status: 'Active' },
        { id: 5, title: 'Susurros del Pasado', director: 'Elena Vargas', genre: ['Terror', 'Paranormal'], duration: 108, releaseDate: '2024-04-01', status: 'Inactive' },
      ];

      setMovies(moviesData);
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const handleAddMovie = () => {
    setCurrentMovie({});
    setShowModal(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setCurrentMovie({ ...movie });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMovie(null);
  };

  const handleSaveMovie = () => {
    // Lógica para guardar la película (crear o actualizar)
    if (currentMovie) {
      if (currentMovie.id) {
        // Actualizar película existente
        setMovies(movies.map(movie => 
          movie.id === currentMovie.id ? { ...movie, ...currentMovie } : movie
        ));
      } else {
        // Crear nueva película
        const newMovie = {
          ...currentMovie,
          id: Math.max(...movies.map(m => m.id)) + 1,
          status: 'Active'
        } as Movie;
        setMovies([...movies, newMovie]);
      }
    }
    
    handleCloseModal();
  };

  const handleDeleteMovie = (id: number) => {
    // Confirmar antes de eliminar
    if (window.confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      setMovies(movies.filter(movie => movie.id !== id));
    }
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <h1>Gestión de Películas</h1>
        <Button variant="primary" onClick={handleAddMovie}>
          <i className="bi bi-plus-lg me-2"></i>
          Agregar Película
        </Button>
      </div>
      
      <div className="mb-4">
        <Form.Control
          type="search"
          placeholder="Buscar películas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Director</th>
            <th>Género</th>
            <th>Duración</th>
            <th>Fecha de Estreno</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredMovies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>{movie.title}</td>
              <td>{movie.director}</td>
              <td>{movie.genre.join(', ')}</td>
              <td>{movie.duration} min</td>
              <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
              <td>
                <Badge bg={movie.status === 'Active' ? 'success' : 'secondary'}>
                  {movie.status}
                </Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditMovie(movie)}>
                  <i className="bi bi-pencil-square"></i>
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMovie(movie.id)}>
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Modal para agregar/editar película */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentMovie?.id ? 'Editar Película' : 'Agregar Película'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control 
                    type="text"
                    value={currentMovie?.title || ''}
                    onChange={(e) => setCurrentMovie({...currentMovie, title: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Director</Form.Label>
                  <Form.Control 
                    type="text"
                    value={currentMovie?.director || ''}
                    onChange={(e) => setCurrentMovie({...currentMovie, director: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duración (minutos)</Form.Label>
                  <Form.Control 
                    type="number"
                    value={currentMovie?.duration || ''}
                    onChange={(e) => setCurrentMovie({...currentMovie, duration: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Estreno</Form.Label>
                  <Form.Control 
                    type="date"
                    value={currentMovie?.releaseDate || ''}
                    onChange={(e) => setCurrentMovie({...currentMovie, releaseDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {/* Más campos: sinopsis, póster, tráiler, etc. */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveMovie}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MovieManagement;