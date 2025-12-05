import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { Button, ValidatedInput, LoadingSpinner } from './common';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../api/api';
import '../styles/components/AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  // Obtenemos la fecha de hoy en formato YYYY-MM-DD para usar como limite maximo
  const hoy = new Date().toISOString().split('T')[0];

  // Fechas por defecto: inicio de mes actual hasta hoy
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(hoy);
  
  const [statsData, setStatsData] = useState({ labels: [], data: [], total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, [fechaInicio, fechaFin]);

  const fetchStats = async () => {
    // Validación de seguridad adicional antes de llamar a la API
    // Evita llamadas innecesarias si las fechas no son logicas
    if (new Date(fechaInicio) > new Date(fechaFin)) return;
    if (new Date(fechaFin) > new Date(hoy)) return;

    setLoading(true);
    try {
      const res = await api.get(`/admin/stats/registros?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      if (res.data.success) {
        setStatsData(res.data.data);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const descargarExcel = () => {
    if (statsData.total === 0) return alert("No hay datos para exportar");
    
    const dataExport = statsData.labels.map((label, idx) => ({
      Fecha: label,
      'Usuarios Registrados': statsData.data[idx]
    }));

    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    XLSX.writeFile(wb, `Registros_${fechaInicio}_${fechaFin}.xlsx`);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Nuevos Usuarios por Día' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  const chartData = {
    labels: statsData.labels,
    datasets: [{
      label: 'Registros',
      data: statsData.data,
      borderColor: 'rgb(27, 138, 94)',
      backgroundColor: 'rgba(27, 138, 94, 0.2)',
      fill: true,
      tension: 0.3
    }]
  };

  return (
    <div className="admin-dashboard container-fluid p-0">
      <div className="dashboard-header mb-4">
        <h3><i className="bi bi-graph-up-arrow me-2"></i>Dashboard de Métricas</h3>
        <p className="text-muted">Visualización de crecimiento de la plataforma</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          {/* Filtros */}
          <div className="row g-3 mb-4 align-items-end">
            <div className="col-md-3">
              <ValidatedInput 
                type="date" 
                label="Desde" 
                value={fechaInicio} 
                onChange={(e) => setFechaInicio(e.target.value)}
                // REGLA: No puede ser mayor a la fecha de fin seleccionada
                max={fechaFin}
              />
            </div>
            <div className="col-md-3">
              <ValidatedInput 
                type="date" 
                label="Hasta" 
                value={fechaFin} 
                onChange={(e) => setFechaFin(e.target.value)}
                // REGLA: No puede ser menor a la fecha de inicio
                min={fechaInicio}
                // REGLA: No puede ser fecha futura
                max={hoy}
              />
            </div>
            <div className="col-md-3">
              <Button 
                variant="success" 
                onClick={descargarExcel} 
                icon="file-earmark-excel"
                disabled={statsData.total === 0}
              >
                Exportar Excel
              </Button>
            </div>
          </div>

          {/* Gráfico */}
          {loading ? <LoadingSpinner /> : (
            <>
              <div className="alert alert-info d-flex align-items-center">
                <i className="bi bi-info-circle-fill me-2 fs-4"></i>
                <div>
                  <strong>Total en el período:</strong> {statsData.total} nuevos usuarios
                </div>
              </div>
              
              <div className="chart-container" style={{ height: '400px', width: '100%' }}>
                {statsData.total > 0 ? (
                  <Line options={chartOptions} data={chartData} />
                ) : (
                  <div className="text-center py-5 text-muted">
                    No hay registros en las fechas seleccionadas.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Link a Google Analytics */}
      <div className="mt-4 text-end">
        <a 
          href="https://analytics.google.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="bi bi-google me-2"></i>Ir a Google Analytics
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;