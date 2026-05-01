/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  BookOpen,
  MapPin,
  Calendar,
  Plus,
  Zap,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_COURSES, MOCK_PROFESSORS, MOCK_ROOMS, MOCK_STUDENTS } from './mockData';
import { SchedulerEngine } from './services/scheduler';
import { Schedule, Course, Professor, Room } from './types';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'courses' | 'professors' | 'rooms' | 'schedules'>('dashboard');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const scheduler = useMemo(() => new SchedulerEngine(MOCK_COURSES, MOCK_PROFESSORS, MOCK_ROOMS), []);

  const generateNewSchedule = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSchedule = scheduler.generateSchedule(`Horario ${schedules.length + 1} - 2024-II`);
      setSchedules([newSchedule, ...schedules]);
      setIsGenerating(false);
      setView('schedules');
    }, 1500);
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-900">AcademiaSync</span>
          </div>

          <nav className="space-y-1">
            <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem active={view === 'courses'} onClick={() => setView('courses')} icon={<BookOpen size={18} />} label="Cursos" />
            <NavItem active={view === 'professors'} onClick={() => setView('professors')} icon={<Users size={18} />} label="Docentes" />
            <NavItem active={view === 'rooms'} onClick={() => setView('rooms')} icon={<MapPin size={18} />} label="Aulas" />
            <NavItem active={view === 'schedules'} onClick={() => setView('schedules')} icon={<Calendar size={18} />} label="Horarios" />
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-100">
          <button
            onClick={generateNewSchedule}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="animate-spin w-4 h-4" /> : <Plus size={18} />}
            <span>Generar Horario</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-semibold text-lg capitalize">{view === 'schedules' ? 'Horarios Generados' : view}</h2>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Periodo: 2026-I</span>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && <Dashboard schedules={schedules} setView={setView} />}
            {view === 'courses' && <EntityList title="Cursos" data={MOCK_COURSES} icon={<BookOpen />} />}
            {view === 'professors' && <EntityList title="Docentes" data={MOCK_PROFESSORS} icon={<Users />} />}
            {view === 'rooms' && <EntityList title="Aulas" data={MOCK_ROOMS} icon={<MapPin />} />}
            {view === 'schedules' && <ScheduleList schedules={schedules} onDelete={deleteSchedule} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Dashboard({ schedules, setView }: { schedules: Schedule[], setView: (v: any) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard icon={<BookOpen className="text-blue-500" />} label="Total Cursos" value={MOCK_COURSES.length} />
        <StatsCard icon={<Users className="text-indigo-500" />} label="Docentes" value={MOCK_PROFESSORS.length} />
        <StatsCard icon={<MapPin className="text-emerald-500" />} label="Aulas" value={MOCK_ROOMS.length} />
        <StatsCard icon={<Calendar className="text-orange-500" />} label="Horarios" value={schedules.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock size={20} className="text-indigo-600" />
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {schedules.length > 0 ? (
              schedules.slice(0, 3).map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">Creado el {new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <CheckCircle size={14} />
                    <span>{s.fitnessScore.toFixed(0)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-8 text-center italic">No hay actividad reciente.</p>
            )}
          </div>
          <button
            onClick={() => setView('schedules')}
            className="w-full mt-4 text-sm text-indigo-600 font-medium hover:underline"
          >
            Ver todos los horarios →
          </button>
        </div>

        <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Generador CSP</h3>
            <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
              Nuestro motor de optimización utiliza algoritmos de satisfacción de restricciones para asegurar que no existan solapamientos entre docentes, aulas y horas.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Validación de Prerrequisitos
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Límite de 20-22 créditos
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Distribución Equitativa
              </li>
            </ul>
          </div>
          <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-indigo-800/50" />
        </div>
      </div>
    </motion.div>
  );
}

function StatsCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:border-indigo-200">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function EntityList({ title, data, icon }: { title: string, data: any[], icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-xl flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <button className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">
          Agregar Nuevo
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 italic">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-all font-normal not-italic">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.id}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {item.credits ? `${item.credits} Créditos` : item.type ? item.type : item.specialties?.length + " Especialidades"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ScheduleList({ schedules, onDelete }: { schedules: Schedule[], onDelete: (id: string) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(schedules[0]?.id || null);

  const activeSchedule = schedules.find(s => s.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Lista de Horarios</h3>
        {schedules.map(s => (
          <div
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`p-4 rounded-2xl cursor-pointer border-2 transition-all relative group ${selectedId === s.id ? 'border-indigo-600 bg-white shadow-md' : 'border-transparent bg-slate-100 hover:bg-white hover:border-slate-300'
              }`}
          >
            <p className="font-bold text-sm text-indigo-900">{s.name}</p>
            <p className="text-xs text-slate-500 mt-1">Éxito: {s.fitnessScore.toFixed(0)}%</p>

            <button
              onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
              className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {schedules.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Sin horarios aún</p>
          </div>
        )}
      </div>

      <div className="lg:col-span-3">
        {activeSchedule ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-2xl font-black text-indigo-950">{activeSchedule.name}</h4>
                  <p className="text-slate-500">Optimizador CSP v1.0 • {activeSchedule.assignments.length} asignaciones</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold">
                  Score: {activeSchedule.fitnessScore.toFixed(1)}
                </div>
              </div>

              {/* Weekly Grid */}
              <div className="grid grid-cols-6 gap-2">
                <div className="bg-slate-50"></div>
                {['Lun', 'Mar', 'Mie', 'Jue', 'Vie'].map(day => (
                  <div key={day} className="text-center py-2 font-bold text-xs uppercase tracking-tighter text-slate-400">{day}</div>
                ))}

                {[7, 9, 11, 14, 16, 18].map(hour => (
                  <React.Fragment key={hour}>
                    <div className="text-right pr-2 py-4 text-[10px] font-bold text-slate-400">{hour}:00</div>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                      const assignment = activeSchedule.assignments.find(a => a.timeSlot.day === day && a.timeSlot.startHour === hour);
                      if (assignment) {
                        const course = MOCK_COURSES.find(c => c.id === assignment.courseId);
                        const prof = MOCK_PROFESSORS.find(p => p.id === assignment.professorId);
                        return (
                          <div key={day} className="bg-indigo-600 text-white p-3 rounded-xl shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
                            <p className="text-[10px] font-bold leading-tight line-clamp-2">{course?.name}</p>
                            <p className="text-[8px] mt-1 opacity-80">{prof?.name.split(' ').pop()}</p>
                            <p className="text-[8px] font-mono mt-0.5 text-indigo-200 uppercase">{assignment.roomId}</p>
                          </div>
                        );
                      }
                      return <div key={day} className="bg-slate-50/50 border border-slate-100 rounded-xl"></div>;
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><GraduationCap size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Cursos Programados</p>
                  <p className="font-bold">{activeSchedule.assignments.length}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Docentes Activos</p>
                  <p className="font-bold">{new Set(activeSchedule.assignments.map(a => a.professorId)).size}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Aulas Utilizadas</p>
                  <p className="font-bold">{new Set(activeSchedule.assignments.map(a => a.roomId)).size}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
            <div>
              <Calendar size={48} className="mx-auto mb-4 opacity-20" />
              <p>Selecciona un horario de la izquierda o genera uno nuevo.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
