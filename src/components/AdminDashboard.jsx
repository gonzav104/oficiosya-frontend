import React, { useState, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import * as XLSX from 'xlsx';
import { Button, ValidatedInput } from './common';
import '../styles/components/AdminDashboard.css';

// Registrar componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Datos estáticos de ejemplo para usuarios registrados por día
const datosUsuarios = {
    '2024-01-15': 3,
    '2024-01-16': 5,
    '2024-01-17': 2,
    '2024-01-18': 8,
    '2024-01-19': 4,
    '2024-01-20': 6,
    '2024-01-21': 7,
    '2024-02-01': 9,
    '2024-02-02': 3,
    '2024-02-03': 12,
    '2024-02-04': 5,
    '2024-02-05': 8,
    '2024-02-10': 15,
    '2024-02-11': 7,
    '2024-02-12': 9,
    '2024-03-01': 11,
    '2024-03-05': 6,
    '2024-03-10': 13,
    '2024-03-15': 8,
    '2024-03-20': 10,
    '2024-04-01': 14,
    '2024-04-05': 7,
    '2024-04-10': 9,
    '2024-04-15': 12,
    '2024-04-20': 5,
    '2024-05-01': 16,
    '2024-05-05': 8,
    '2024-05-10': 11,
    '2024-05-15': 9,
    '2024-05-20': 13,
    '2024-06-01': 18,
    '2024-06-05': 10,
    '2024-06-10': 14,
    '2024-06-15': 7,
    '2024-06-20': 12,
    '2024-07-01': 20,
    '2024-07-05': 15,
    '2024-07-10': 11,
    '2024-07-15': 9,
    '2024-07-20': 17,
    '2024-08-01': 22,
    '2024-08-05': 13,
    '2024-08-10': 16,
    '2024-08-15': 8,
    '2024-08-20': 19,
    '2024-09-01': 25,
    '2024-09-05': 12,
    '2024-09-10': 18,
    '2024-09-15': 14,
    '2024-09-20': 21,
    '2024-10-01': 28,
    '2024-10-05': 16,
    '2024-10-10': 20,
    '2024-10-15': 11,
    '2024-10-20': 24,
    '2024-11-01': 30,
    '2024-11-05': 18,
    '2024-11-10': 22,
    '2024-11-15': 13,
    '2024-11-20': 26,
    '2024-12-01': 32,
    '2024-12-05': 20,
    '2024-12-10': 25,
    '2024-12-15': 15,
    '2024-12-20': 29
  };

// Datos estáticos para Google Analytics (simulados)
const datosAnalytics = {
    usuariosActivos: 1247,
    dispositivosData: {
      labels: ['Móvil', 'Escritorio', 'Tablet'],
      datasets: [{
        data: [65, 30, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    },
    ubicacionesData: {
      'Argentina': 85,
      'Uruguay': 8,
      'Chile': 4,
      'Brasil': 2,
      'Otros': 1
    },
    sesionesHoy: 342,
    tiempoPromedio: '4:23',
    paginasVistas: 2847
  };

function AdminDashboard() {
  // Estados para filtros de fecha
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-12-31');
  const [tipoGrafico, setTipoGrafico] = useState('dia'); // dia, semana, mes
  
  // Validar rangos y obtener datos filtrados
  const { erroresValidacion, datosFiltrados } = useMemo(() => {
    const errores = [];
    const hoy = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Validar fechas futuras
    if (inicio > hoy) {
      errores.push('La fecha de inicio no puede ser futura');
    }
    if (fin > hoy) {
      errores.push('La fecha de fin no puede ser futura');
    }

    // Validar rango lógico
    if (inicio > fin) {
      errores.push('La fecha de inicio debe ser anterior o igual a la fecha de fin');
    }

    // Si hay errores, retornar datos vacíos
    if (errores.length > 0) {
      return {
        erroresValidacion: errores,
        datosFiltrados: { labels: [], data: [], total: 0 }
      };
    }

    // Filtrar datos si no hay errores
    const datosFiltradosTemp = [];
    const labels = [];
    let total = 0;

    Object.entries(datosUsuarios).forEach(([fecha, cantidad]) => {
      const fechaObj = new Date(fecha);
      if (fechaObj >= inicio && fechaObj <= fin) {
        labels.push(fecha);
        datosFiltradosTemp.push(cantidad);
        total += cantidad;
      }
    });

    return {
      erroresValidacion: errores,
      datosFiltrados: { labels, data: datosFiltradosTemp, total }
    };
  }, [fechaInicio, fechaFin]);

  // Función para agrupar datos según el tipo de gráfico
  const agruparDatos = (labels, data) => {
    if (tipoGrafico === 'dia') {
      return { labels, data };
    }

    // Agrupar por semana o mes
    const agrupados = {};
    labels.forEach((fecha, index) => {
      const fechaObj = new Date(fecha);
      let clave;
      
      if (tipoGrafico === 'semana') {
        const semana = Math.floor(fechaObj.getDate() / 7) + 1;
        clave = `Semana ${semana} - ${fechaObj.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}`;
      } else if (tipoGrafico === 'mes') {
        clave = fechaObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      }

      if (!agrupados[clave]) {
        agrupados[clave] = 0;
      }
      agrupados[clave] += data[index];
    });

    return {
      labels: Object.keys(agrupados),
      data: Object.values(agrupados)
    };
  };

  // Obtener datos para el gráfico
  const { labels, data, total } = datosFiltrados;
  const datosAgrupados = agruparDatos(labels, data);

  // Configuración del gráfico de líneas
  const configGraficoLineas = {
    labels: datosAgrupados.labels,
    datasets: [
      {
        label: 'Usuarios Registrados',
        data: datosAgrupados.data,
        borderColor: 'rgb(27, 138, 94)',
        backgroundColor: 'rgba(27, 138, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(27, 138, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Configuración del gráfico de barras
  const configGraficoBarras = {
    labels: datosAgrupados.labels,
    datasets: [
      {
        label: 'Usuarios Registrados',
        data: datosAgrupados.data,
        backgroundColor: 'rgba(27, 138, 94, 0.8)',
        borderColor: 'rgb(27, 138, 94)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones para los gráficos
  const opcionesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Registros de Usuarios por ${tipoGrafico.charAt(0).toUpperCase() + tipoGrafico.slice(1)}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Función para descargar Excel
  const descargarExcel = () => {
    if (erroresValidacion.length > 0) {
      alert('Por favor corrige los errores en el rango de fechas antes de descargar.');
      return;
    }

    if (datosFiltrados.total === 0) {
      alert('No hay datos en el rango seleccionado para descargar.');
      return;
    }

    // Crear datos para Excel
    const datosExcel = [];
    datosFiltrados.labels.forEach((fecha, index) => {
      datosExcel.push({
        'Fecha': fecha,
        'Usuarios Registrados': datosFiltrados.data[index]
      });
    });

    // Agregar fila de total
    datosExcel.push({
      'Fecha': 'TOTAL',
      'Usuarios Registrados': datosFiltrados.total
    });

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios Registrados');

    // Descargar archivo
    const nombreArchivo = `usuarios_registrados_${fechaInicio}_${fechaFin}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);

    alert(`Archivo descargado exitosamente: ${nombreArchivo}`);
  };

  // Configuración del gráfico de dispositivos
  const opcionesDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Distribución por Dispositivos',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
    },
  };

  return (
    <div className="admin-dashboard">
      {/* HEADER DEL DASHBOARD */}
      <div className="dashboard-header mb-4">
        <h3 className="mb-1">
          <i className="bi bi-graph-up-arrow me-2"></i>
          Dashboard de Análisis
        </h3>
        <p className="text-muted mb-0">
          Métricas y estadísticas de la plataforma
        </p>
      </div>

      {/* SECCIÓN 1: FILTROS Y VALIDACIONES */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-calendar-range me-2"></i>
            Análisis de Registros por Período
          </h5>
        </div>
        <div className="card-body">
          {/* Filtros de fecha */}
          <div className="row mb-3">
            <div className="col-md-3">
              <ValidatedInput
                type="date"
                name="fechaInicio"
                label="Fecha de Inicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                error={erroresValidacion.find(e => e.includes('inicio'))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="col-md-3">
              <ValidatedInput
                type="date"
                name="fechaFin"
                label="Fecha de Fin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                error={erroresValidacion.find(e => e.includes('fin'))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="col-md-3">
              <ValidatedInput
                type="select"
                label="Vista"
                value={tipoGrafico}
                onChange={(e) => setTipoGrafico(e.target.value)}
              >
                <option value="dia">Por Día</option>
                <option value="semana">Por Semana</option>
                <option value="mes">Por Mes</option>
              </ValidatedInput>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <Button 
                variant="success"
                onClick={descargarExcel}
                disabled={erroresValidacion.length > 0}
                icon="file-earmark-excel"
                className="me-2"
              >
                Exportar Excel
              </Button>
            </div>
          </div>

          {/* Errores de validación */}
          {erroresValidacion.length > 0 && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Errores de validación:</strong>
              <ul className="mb-0 mt-2">
                {erroresValidacion.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Total de usuarios en el rango */}
          {erroresValidacion.length === 0 && (
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="stat-card-dashboard">
                  <div className="stat-icon">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="stat-info">
                    <h2>{total}</h2>
                    <p>Usuarios registrados en el período</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card-dashboard">
                  <div className="stat-icon">
                    <i className="bi bi-calendar-range"></i>
                  </div>
                  <div className="stat-info">
                    <h2>{labels.length}</h2>
                    <p>Días con registros</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card-dashboard">
                  <div className="stat-icon">
                    <i className="bi bi-graph-up"></i>
                  </div>
                  <div className="stat-info">
                    <h2>{labels.length > 0 ? Math.round(total / labels.length) : 0}</h2>
                    <p>Promedio por día</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alerta sin datos */}
          {erroresValidacion.length === 0 && total === 0 && (
            <div className="alert alert-warning">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Sin datos:</strong> No hay registros de usuarios en el rango de fechas seleccionado.
            </div>
          )}

          {/* Gráficos */}
          {erroresValidacion.length === 0 && total > 0 && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="chart-container">
                  <Line data={configGraficoLineas} options={opcionesGrafico} />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="chart-container">
                  <Bar data={configGraficoBarras} options={opcionesGrafico} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: GOOGLE ANALYTICS*/}
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-activity me-2"></i>
                Métricas en Tiempo Real
                <span className="badge bg-success ms-2">
                  <i className="bi bi-circle-fill me-1" style={{fontSize: '8px'}}></i>
                  EN VIVO
                </span>
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="analytics-stat">
                    <div className="analytics-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="analytics-info">
                      <h3>{datosAnalytics.usuariosActivos.toLocaleString()}</h3>
                      <p>Usuarios Activos</p>
                      <small className="text-muted">Últimas 24 horas</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="analytics-stat">
                    <div className="analytics-icon">
                      <i className="bi bi-graph-up"></i>
                    </div>
                    <div className="analytics-info">
                      <h3>{datosAnalytics.sesionesHoy}</h3>
                      <p>Sesiones Hoy</p>
                      <small className="text-muted">Tiempo promedio: {datosAnalytics.tiempoPromedio}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <div className="analytics-stat">
                    <div className="analytics-icon">
                      <i className="bi bi-eye"></i>
                    </div>
                    <div className="analytics-info">
                      <h3>{datosAnalytics.paginasVistas.toLocaleString()}</h3>
                      <p>Páginas Vistas</p>
                      <small className="text-muted">Total del día</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicaciones geográficas */}
              <div className="ubicaciones-container mt-4">
                <h6 className="mb-3">
                  <i className="bi bi-geo-alt me-2"></i>
                  Distribución Geográfica
                </h6>
                <div className="ubicaciones-lista">
                  {Object.entries(datosAnalytics.ubicacionesData).map(([pais, porcentaje]) => (
                    <div key={pais} className="ubicacion-item">
                      <div className="ubicacion-info">
                        <span className="pais-nombre">{pais}</span>
                        <span className="pais-porcentaje">{porcentaje}%</span>
                      </div>
                      <div className="progress" style={{height: '4px'}}>
                        <div 
                          className="progress-bar bg-primary"
                          style={{width: `${porcentaje}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DISTRIBUCIÓN POR DISPOSITIVOS */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-devices me-2"></i>
                Dispositivos
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container-small">
                <Doughnut data={datosAnalytics.dispositivosData} options={opcionesDoughnut} />
              </div>
              
              {/* Estadísticas de dispositivos */}
              <div className="dispositivos-stats mt-3">
                {datosAnalytics.dispositivosData.labels.map((dispositivo, index) => (
                  <div key={dispositivo} className="dispositivo-stat">
                    <div className="dispositivo-icon">
                      <i className={`bi bi-${
                        dispositivo === 'Móvil' ? 'phone' : 
                        dispositivo === 'Escritorio' ? 'laptop' : 'tablet'
                      }`}></i>
                    </div>
                    <div className="dispositivo-info">
                      <span className="dispositivo-nombre">{dispositivo}</span>
                      <span className="dispositivo-porcentaje">
                        {datosAnalytics.dispositivosData.datasets[0].data[index]}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: INFORMACIÓN ADICIONAL */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Información del Sistema
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="info-item">
                <i className="bi bi-calendar-check me-2"></i>
                <strong>Última actualización:</strong> {new Date().toLocaleString('es-ES')}
              </div>
              <div className="info-item">
                <i className="bi bi-server me-2"></i>
                <strong>Estado del servidor:</strong> 
                <span className="badge bg-success ms-2">Operativo</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="info-item">
                <i className="bi bi-graph-up me-2"></i>
                <strong>Versión Analytics:</strong> GA4 - Universal Analytics
              </div>
              <div className="info-item">
                <i className="bi bi-shield-check me-2"></i>
                <strong>Datos:</strong> Actualizados en tiempo real
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;