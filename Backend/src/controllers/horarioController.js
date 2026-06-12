import pool from '../config/db.js';

// 1. Obtener la grilla completa leyendo directamente de la VISTA de Postgres
export const getHorarioCompleto = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_horario_completo ORDER BY dia, hora_inicio');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Asignar un horario a un grupo (Con manejo de colisión de aula/hora nativo de Postgres)
export const createHorarioClase = async (req, res) => {
  const { id_grupo, dia, hora_inicio, hora_fin, id_aula } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO horarios_clase (id_grupo, dia, hora_inicio, hora_fin, id_aula) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_grupo, dia, hora_inicio, hora_fin, id_aula]
    );
    res.status(201).json({ message: "Horario asignado con éxito", data: result.rows[0] });
  } catch (error) {
    // Si Postgres lanza un error debido al CONSTRAINT de exclusión de choques
    if (error.code === '23P11') { 
      return res.status(409).json({ 
        error: "Conflicto de Horario", 
        message: "El aula ya está ocupada en ese día y rango horario seleccionado." 
      });
    }
    res.status(400).json({ error: error.message });
  }
};
