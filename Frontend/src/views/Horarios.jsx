import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingGenerar, setLoadingGenerar] = useState(false);

  // 1. ENDPOINT GET: Consumir la lista de horarios ya existentes en la BD
  const fetchHorarios = async () => {
    setLoadingFetch(true);
    try {
      const { data } = await api.get('/horarios');
      setHorarios(data);
    } catch (err) {
      console.error("Error al traer franjas horarias:", err);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => { 
    fetchHorarios(); 
  }, []);

  // 2. ENDPOINT POST: Consumir el motor externo /procesar (Scheduler Engine)
  const handleProcesarAlgoritmo = async () => {
    if (!confirm("¿Deseas activar el algoritmo para optimizar y proponer una nueva distribución académica automáticamente?")) return;
    
    setLoadingGenerar(true);
    try {
      const response = await api.post('/horarios/procesar', {
        periodo_academico: '2026-1',
        codigo_grupo_defecto: 'SEC-A'
      });
      
      alert(`¡Éxito!\n${response.data.message}`);
      fetchHorarios();
    } catch (error) {
      alert(error.response?.data?.error || "Error crítico en el motor de asignación por restricciones");
    } finally {
      setLoadingGenerar(false);
    }
  };

  return (
    <div className="p-6">
      {/* Cabecera Principal */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Franjas Horarias Operativas</h2>
          <p className="text-sm text-slate-500">Visualización de distribución espacial de aulas y maestros por bloques.</p>
        </div>
        
        {/* Botón de Generación Inteligente */}
        <button 
          onClick={handleProcesarAlgoritmo}
          disabled={loadingGenerar || loadingFetch}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          {loadingGenerar ? '🤖 Procesando Algoritmo...' : '⚙️ Generación CSP Inteligente'}
        </button>
      </div>

      {/* Grid de Horarios Dinámicos */}
      {loadingFetch ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : horarios.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto mt-8">
          <p className="text-slate-500 font-medium text-base mb-1">No hay horarios registrados</p>
          <p className="text-slate-400 text-xs">Presiona el botón superior "Generación CSP Inteligente" para construir la grilla inicial.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {horarios.map((h, index) => (
            <div 
              key={h.id_horario || index} 
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    {h.dia_semana || h.dia || 'No asignado'}
                  </span>
                  <span className="text-slate-500 font-mono text-xs font-semibold bg-slate-50 px-2 py-1 rounded-md">
                    {h.hora_inicio?.slice(0, 5)} - {h.hora_fin?.slice(0, 5)}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Asignatura / Curso</p>
                {/* CORRECCIÓN CRÍTICA: Mapeo multivariable para capturar el nombre de la materia 
                  sin importar cómo venga formateada desde la respuesta JSON.
                */}
                <p className="text-base font-bold text-slate-900 leading-tight mb-3">
                  {h.nombre_materia || h.materia || h.nombre || `Grupo Operativo #${h.id_grupo}`}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  📍 Aula: <strong className="text-slate-900 font-semibold">{h.codigo_aula || h.id_aula || 'S/A'}</strong>
                </span>
                <span className="text-slate-400 font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                  Sec: {h.codigo_grupo || h.id_grupo}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}