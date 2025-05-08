// src/apps/platform/routes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PlatformLayout from './PlatformLayout';
import CreateCinema from './CreateCinema';

// Esta es una página muy simple para tener algo en el dashboard
const DashboardPlaceholder: React.FC = () => (
  <div className="container-fluid py-4">
    <h1>Platform Admin Dashboard</h1>
    <p>Bienvenido al panel de administración de la plataforma.</p>
    <p>Utiliza la navegación para acceder a las diferentes secciones.</p>
  </div>
);

// Esta es una página temporal que mostrará un mensaje para las secciones no implementadas
const NotImplemented: React.FC<{title: string}> = ({ title }) => (
  <div className="container-fluid py-4">
    <h1>{title}</h1>
    <div className="alert alert-info">
      Esta sección aún no está implementada.
    </div>
  </div>
);

const PlatformRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PlatformLayout />}>
        <Route index element={<DashboardPlaceholder />} />
        <Route path="cinemas">
          <Route index element={<NotImplemented title="Listado de Cines" />} />
          <Route path="create" element={<CreateCinema />} />
          <Route path=":id" element={<NotImplemented title="Detalles de Cine" />} />
          <Route path=":id/edit" element={<NotImplemented title="Editar Cine" />} />
        </Route>
        <Route path="users" element={<NotImplemented title="Usuarios" />} />
        <Route path="settings" element={<NotImplemented title="Configuración Global" />} />
      </Route>
    </Routes>
  );
};

export default PlatformRoutes;