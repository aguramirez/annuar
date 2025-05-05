// src/common/components/DataTable.tsx
import React, { useState } from 'react';
import { Table, Form, Pagination } from 'react-bootstrap';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  itemsPerPage?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  itemsPerPage = 10,
  searchable = false,
  searchPlaceholder = 'Buscar...'
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'ascending' | 'descending';
  }>({
    key: null,
    direction: 'ascending'
  });

  // Filtrado
  const filteredData = searchable
    ? data.filter((item) => {
        return Object.values(item).some((value) => {
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      })
    : data;

  // Ordenamiento
  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof T) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (column: keyof T) => {
    if (sortConfig.key !== column) return <i className="bi bi-arrow-down-up text-muted"></i>;
    return sortConfig.direction === 'ascending' 
      ? <i className="bi bi-sort-down"></i> 
      : <i className="bi bi-sort-up"></i>;
  };

  return (
    <div className="data-table">
      {searchable && (
        <div className="mb-3">
          <Form.Control
            type="search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      )}

      <Table responsive striped hover>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                onClick={() => {
                  if (column.sortable && typeof column.accessor === 'string') {
                    handleSort(column.accessor);
                  }
                }}
                style={{ 
                  cursor: column.sortable ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
              >
                <div className="d-flex align-items-center">
                  <span>{column.header}</span>
                  {column.sortable && typeof column.accessor === 'string' && (
                    <span className="ms-2">
                      {getSortIcon(column.accessor)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <tr key={String(item[keyField])}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor] || '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No hay datos para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted">
            Mostrando {paginatedData.length} de {filteredData.length} resultados
          </div>
          <Pagination>
            <Pagination.First 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
            />
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Lógica para mostrar 5 páginas alrededor de la página actual
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            
            <Pagination.Next 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default DataTable;