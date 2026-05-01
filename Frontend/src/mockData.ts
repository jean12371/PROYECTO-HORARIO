import { Course, Professor, Room, Student } from './types';

export const MOCK_COURSES: Course[] = [
  { id: 'C1', name: 'Algoritmos y Estructura de Datos', credits: 4, prerequisites: [], department: 'Ingeniería' },
  { id: 'C2', name: 'Bases de Datos I', credits: 4, prerequisites: ['C1'], department: 'Ingeniería' },
  { id: 'C3', name: 'Ingeniería de Software II', credits: 4, prerequisites: ['C2'], department: 'Ingeniería' },
  { id: 'C4', name: 'Cálculo Diferencial', credits: 3, prerequisites: [], department: 'Ciencias' },
  { id: 'C5', name: 'Sistemas Operativos', credits: 4, prerequisites: ['C1'], department: 'Ingeniería' },
  { id: 'C6', name: 'Ética y Constitución', credits: 2, prerequisites: [], department: 'Humanidades' },
  { id: 'C7', name: 'Inteligencia Artificial', credits: 4, prerequisites: ['C1', 'C2'], department: 'Ingeniería' },
];

export const MOCK_PROFESSORS: Professor[] = [
  { id: 'P1', name: 'Dr. Roberto Gómez', specialties: ['C1', 'C7'], availability: [] },
  { id: 'P2', name: 'Dra. María Torres', specialties: ['C2', 'C3', 'C5'], availability: [] },
  { id: 'P3', name: 'Mag. Luis Prado', specialties: ['C4', 'C6'], availability: [] },
  { id: 'P4', name: 'Dra. Ana Belén', specialties: ['C1', 'C2', 'C3'], availability: [] },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'A101', name: 'Aula 101', capacity: 40, type: 'theory' },
  { id: 'L202', name: 'Lab Computación 202', capacity: 25, type: 'lab' },
  { id: 'A103', name: 'Aula 103', capacity: 35, type: 'theory' },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 'S1', name: 'Alexandro Rua', enrolledCourses: ['C1', 'C4'], completedCourses: [], maxCredits: 22 },
];
