import { Router } from 'express';
import { getHorarioCompleto, createHorarioClase } from '../controllers/horarioController.js';
import { verificarToken, permitirRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// 1. Cualquier usuario autenticado (Estudiante, Profesor, Admin) puede ver el horario completo
router.get('/vista-completa', verificarToken, getHorarioCompleto);

// 2. SOLO el rol 'Administrador' puede crear o alterar la asignación de horarios clase
router.post('/', verificarToken, permitirRoles('Administrador'), createHorarioClase);

export default router;