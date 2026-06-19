import { useEffect, useState } from 'react';
import api from '../api/axios';
import CRUDGrid from '../components/CRUDGrid';

export default function Aulas() {
  const [aulas, setAulas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id_edificio: '', codigo_aula: '', capacidad: '', tipo_aula: 'Teoría' });

  const fetchAulas = async () => {
    const { data } = await api.get('/aulas');
    setAulas(data);
  };

  useEffect(() => { fetchAulas(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/aulas', formData);
      setShowModal(false);
      setFormData({ id_edificio: '', codigo_aula: '', capacidad: '', tipo_aula: 'Teoría' });
      fetchAulas();
    } catch (err) { alert(err.response?.data?.error); }
  };

  const columns = [
    { key: 'codigo_aula', label: 'Código Aula', render: (item) => <span className="font-mono font-bold text-slate-900">{item.codigo_aula}</span> },
    { key: 'tipo_aula', label: 'Tipo', render: (item) => <span className={`px-2 py-1 text-xs font-semibold rounded-md ${item.tipo_aula === 'Laboratorio' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{item.tipo_aula}</span> },
    { key: 'capacidad', label: 'Capacidad', render: (item) => `${item.capacidad} Estudiantes` },
    { key: 'nombre_edificio', label: 'Ubicación / Edificio', render: (item) => item.nombre_edificio || 'Sin Asignar' }
  ];

  return (
    <>
      <CRUDGrid 
        title="Control de Aulas"
        subtitle="Registro físico de salones y laboratorios del campus universitario."
        data={aulas}
        columns={columns}
        onAdd={() => setShowModal(true)}
        searchPlaceholder="Buscar por código de aula o tipo..."
      />

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Añadir Aula Física</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Identificador Edificio (ID Númerico)</label>
                <input type="number" required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" value={formData.id_edificio} onChange={e => setFormData({...formData, id_edificio: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Código del Aula</label>
                <input type="text" required placeholder="Ej: LAB-302" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" value={formData.codigo_aula} onChange={e => setFormData({...formData, codigo_aula: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Capacidad Máxima</label>
                <input type="number" required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" value={formData.capacidad} onChange={e => setFormData({...formData, capacidad: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo de Ambiente</label>
                <select className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 bg-white" value={formData.tipo_aula} onChange={e => setFormData({...formData, tipo_aula: e.target.value})}>
                  <option value="Teoría">Teoría (Salón Estándar)</option>
                  <option value="Laboratorio">Laboratorio Especializado</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}