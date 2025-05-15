import React, { useState } from 'react';

// Mock employee sales data
const mockEmployeeSalesData = [
  {
    id: 1,
    name: "María García",
    position: "Cajero/a",
    salesData: [
      { date: "2025-05-01", ticketSales: 15000, candySales: 8000, totalSales: 23000, transactions: 42, averageTransaction: 547.62, expectedCash: 23000, reportedCash: 23000, variance: 0, variances: [] },
      { date: "2025-05-02", ticketSales: 18500, candySales: 9200, totalSales: 27700, transactions: 51, averageTransaction: 543.14, expectedCash: 27700, reportedCash: 27300, variance: -400, variances: [{ type: "Candy", amount: -400, reason: "Error en cálculo" }] },
      { date: "2025-05-03", ticketSales: 22400, candySales: 12500, totalSales: 34900, transactions: 65, averageTransaction: 536.92, expectedCash: 34900, reportedCash: 34900, variance: 0, variances: [] },
      { date: "2025-05-04", ticketSales: 24000, candySales: 15800, totalSales: 39800, transactions: 72, averageTransaction: 552.78, expectedCash: 39800, reportedCash: 39800, variance: 0, variances: [] },
      { date: "2025-05-05", ticketSales: 12000, candySales: 6500, totalSales: 18500, transactions: 35, averageTransaction: 528.57, expectedCash: 18500, reportedCash: 18500, variance: 0, variances: [] }
    ],
    totalSales: 143900,
    averageVariance: -80
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    position: "Cajero/a",
    salesData: [
      { date: "2025-05-01", ticketSales: 12500, candySales: 6800, totalSales: 19300, transactions: 38, averageTransaction: 507.89, expectedCash: 19300, reportedCash: 18800, variance: -500, variances: [{ type: "Ticket", amount: -500, reason: "Pendiente de investigación" }] },
      { date: "2025-05-02", ticketSales: 14200, candySales: 7300, totalSales: 21500, transactions: 41, averageTransaction: 524.39, expectedCash: 21500, reportedCash: 21000, variance: -500, variances: [{ type: "Candy", amount: -500, reason: "Pendiente de investigación" }] },
      { date: "2025-05-03", ticketSales: 18300, candySales: 8900, totalSales: 27200, transactions: 55, averageTransaction: 494.55, expectedCash: 27200, reportedCash: 26700, variance: -500, variances: [{ type: "Candy", amount: -500, reason: "Pendiente de investigación" }] },
      { date: "2025-05-04", ticketSales: 21500, candySales: 11200, totalSales: 32700, transactions: 63, averageTransaction: 519.05, expectedCash: 32700, reportedCash: 32200, variance: -500, variances: [{ type: "Ticket", amount: -500, reason: "Pendiente de investigación" }] },
      { date: "2025-05-05", ticketSales: 10500, candySales: 5800, totalSales: 16300, transactions: 30, averageTransaction: 543.33, expectedCash: 16300, reportedCash: 15800, variance: -500, variances: [{ type: "Candy", amount: -500, reason: "Pendiente de investigación" }] }
    ],
    totalSales: 117000,
    averageVariance: -500,
    isFlagged: true
  },
  {
    id: 3,
    name: "Ana Martínez",
    position: "Cajero/a Senior",
    salesData: [
      { date: "2025-05-01", ticketSales: 19500, candySales: 12000, totalSales: 31500, transactions: 58, averageTransaction: 543.10, expectedCash: 31500, reportedCash: 31800, variance: 300, variances: [{ type: "Candy", amount: 300, reason: "Error en cálculo" }] },
      { date: "2025-05-02", ticketSales: 22300, candySales: 13500, totalSales: 35800, transactions: 64, averageTransaction: 559.38, expectedCash: 35800, reportedCash: 35800, variance: 0, variances: [] },
      { date: "2025-05-03", ticketSales: 25800, candySales: 16200, totalSales: 42000, transactions: 75, averageTransaction: 560.00, expectedCash: 42000, reportedCash: 42000, variance: 0, variances: [] },
      { date: "2025-05-04", ticketSales: 28500, candySales: 18000, totalSales: 46500, transactions: 82, averageTransaction: 567.07, expectedCash: 46500, reportedCash: 46500, variance: 0, variances: [] },
      { date: "2025-05-05", ticketSales: 15200, candySales: 9500, totalSales: 24700, transactions: 45, averageTransaction: 548.89, expectedCash: 24700, reportedCash: 24700, variance: 0, variances: [] }
    ],
    totalSales: 180500,
    averageVariance: 60
  }
];

const EmployeeSalesMetrics = () => {
  const [employees] = useState(mockEmployeeSalesData);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '2025-05-01',
    end: '2025-05-05'
  });
  
  // Filter function to filter employees with suspicious patterns
  const flaggedEmployees = employees.filter(emp => emp.averageVariance < -200 || emp.isFlagged);
  
  // Handle employee selection
  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('es-AR')}`;
  };
  
  return (
    <div className="employee-metrics-container">
      <div className="mb-4">
        <h2 className="mb-3">Métricas de Ventas por Empleado</h2>
        <p className="text-muted">
          Monitorea las ventas y discrepancias en efectivo por empleado para detectar posibles problemas.
        </p>
        
        {/* Alert for flagged employees */}
        {flaggedEmployees.length > 0 && (
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Atención:</strong> {flaggedEmployees.length} empleado(s) con patrones de discrepancia detectados.
          </div>
        )}
      </div>
      
      {/* Date range filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <label className="form-label">Fecha Inicio:</label>
              <input 
                type="date" 
                className="form-control"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Fecha Fin:</label>
              <input 
                type="date" 
                className="form-control"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button className="btn btn-primary mt-md-0 mt-3">
                <i className="bi bi-search me-2"></i>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Employees summary table */}
      <div className="card mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Resumen de Empleados</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
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
                      {employee.averageVariance < 0 ? '-' : '+'}{formatCurrency(Math.abs(employee.averageVariance))}
                    </td>
                    <td className="text-center">
                      {employee.averageVariance < -200 ? (
                        <span className="badge bg-danger">Alerta</span>
                      ) : employee.averageVariance < 0 ? (
                        <span className="badge bg-warning text-dark">Revisar</span>
                      ) : (
                        <span className="badge bg-success">Normal</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleSelectEmployee(employee)}
                      >
                        <i className="bi bi-graph-up me-1"></i>
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Selected employee details */}
      {selectedEmployee && (
        <div className="card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Detalles de {selectedEmployee.name}</h5>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSelectedEmployee(null)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
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
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Detailed variance report for the selected employee */}
      {selectedEmployee && selectedEmployee.salesData.some(day => day.variances.length > 0) && (
        <div className="card mt-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">Reporte de Discrepancias</h5>
          </div>
          <div className="card-body">
            <table className="table">
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
                          <span className="badge bg-warning text-dark">Pendiente</span>
                        ) : (
                          <span className="badge bg-info">Registrado</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            
            {selectedEmployee.isFlagged && (
              <div className="alert alert-danger mt-3">
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
              </div>
            )}
            
            <div className="mt-3">
              <button className="btn btn-outline-primary me-2">
                <i className="bi bi-printer me-1"></i>
                Imprimir Reporte
              </button>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-file-earmark-excel me-1"></i>
                Exportar a Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalesMetrics;