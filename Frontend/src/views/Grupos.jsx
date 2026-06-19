import { useEffect, useState } from 'react';
import api from '../api/axios';
import CRUDGrid from '../components/CRUDGrid';

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id_materia: '', id_profesor: '', codigo_grupo: '', periodo_academico: '2026-1', cupo_maximo: '' });

  const fetchGrupos = async () => {
    const { data } = await api.get('/grupos');
    setGrupos(data);
  };

  useEffect(() => { fetchGrupos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/grupos', formData);
      setShowModal(false);
      setFormData({ id_materia: '', id_profesor: '', codigo_grupo: '', periodo_academico: '2026-1', cupo_maximo: '' });
      fetchGrupos();
    } catch (err) { alert(err.response?.data?.error); }
  };

  // ========================================================
  // SECCIÓN MODIFICADA: Adaptación de columnas para mapear la BD
  // ========================================================
  const columns = [
    { 
      key: 'codigo_grupo', 
      label: 'Grupo / Sección', 
      render: (item) => <strong className="text-blue-600">{item.codigo_grupo || item.grupo}</strong> 
    },
    { 
      key: 'nombre_materia', 
      label: 'Materia Vinculada',
      // Modificación clave: Si 'nombre_materia' no viene, busca alternativas o muestra un estado elegante
      render: (item) => item.nombre_materia || item.materia || <span className="text-slate-400 italic">No asignada</span>
    },
    { 
      key: 'periodo_academico', 
      label: 'Ciclo / Periodo',
      render: (item) => item.periodo_academico || item.ciclo_periodo 
    },
    { 
      key: 'cupo_maximo', 
      label: 'Aforo Máximo', 
      render: (item) => `${item.cupo_maximo || item.aforo_maximo || 0} Vacantes` 
    }
  ];

  return (
    <>
      <CRUDGrid 
        title="Grupos y Comisiones"
        subtitle="Secciones operativas abiertas para matrícula por periodo académico."
        data={grupos}
        columns={columns}
        onAdd={() => setShowModal(true)}
        searchPlaceholder="Filtrar por grupo o nombre de materia..."
      />

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Crear Grupo / Sección</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ID Materia</label>
                  <input type="number" required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm" value={formData.id_materia} onChange={e => setFormData({...formData, id_materia: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ID Docente</label>
                  <input type="number" required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm" value={formData.id_profesor} onChange={e => setFormData({...formData, id_profesor: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Código de Grupo</label>
                <input type="text" required placeholder="Ej: GR-01" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm" value={formData.codigo_grupo} onChange={e => setFormData({...formData, codigo_grupo: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Periodo Escolar</label>
                <input type="text" required placeholder="2026-1" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm" value={formData.periodo_academico} onChange={e => setFormData({...formData, periodo_academico: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cupos Dispuestos</label>
                <input type="number" required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm" value={formData.cupo_maximo} onChange={e => setFormData({...formData, cupo_maximo: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700">Abrir Grupo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}