import React, { useState, useEffect } from 'react';
import { Button, ValidatedInput, LoadingSpinner } from './common';
import api from '../api/api';

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCat, setNuevaCat] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar categorías al iniciar
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categorias');
      const lista = res.data.data?.categoriasCompletas || res.data.data || [];
      setCategorias(lista);
    } catch (err) {
      console.error(err);
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nuevaCat.nombre.trim()) return;

    try {
      await api.post('/categorias/create', nuevaCat);
      setNuevaCat({ nombre: '', descripcion: '' });
      alert('Categoría creada exitosamente');
      fetchCategorias(); // Recargar lista
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear categoría');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      await api.delete(`/categorias/delete/${id}`);
      fetchCategorias();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar. Verifica que no tenga prestadores asociados.');
    }
  };

  return (
    <div className="card main-card">
      <div className="card-header">
        <h5><i className="bi bi-tags me-2"></i>Gestión de Categorías</h5>
      </div>
      <div className="card-body">
        {/* Formulario de Alta */}
        <form onSubmit={handleCreate} className="row g-3 mb-4 align-items-end p-3 bg-light rounded">
          <div className="col-md-4">
            <ValidatedInput
              label="Nombre"
              value={nuevaCat.nombre}
              onChange={(e) => setNuevaCat({...nuevaCat, nombre: e.target.value})}
              placeholder="Ej: Plomería"
            />
          </div>
          <div className="col-md-6">
            <ValidatedInput
              label="Descripción"
              value={nuevaCat.descripcion}
              onChange={(e) => setNuevaCat({...nuevaCat, descripcion: e.target.value})}
              placeholder="Breve descripción del servicio..."
            />
          </div>
          <div className="col-md-2">
            <Button type="submit" variant="success" icon="plus-circle" className="w-100">
              Agregar
            </Button>
          </div>
        </form>

        <hr />

        {/* Listado */}
        {loading ? <LoadingSpinner /> : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(cat => (
                  <tr key={cat.id_categoria}>
                    <td className="fw-bold">{cat.nombre}</td>
                    <td className="text-muted small">{cat.descripcion}</td>
                    <td className="text-end">
                      <Button 
                        variant="outline-danger" 
                        size="small" 
                        onClick={() => handleDelete(cat.id_categoria)}
                        icon="trash"
                        title="Eliminar categoría"
                      />
                    </td>
                  </tr>
                ))}
                {categorias.length === 0 && (
                  <tr><td colSpan="3" className="text-center py-3">No hay categorías registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategorias;