import pool from '../config/db.js';

export const getGrupos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grupos');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createGrupo = async (req, res) => {
  const { id_materia, id_profesor, codigo_grupo, periodo_academico, cupo_maximo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO grupos (id_materia, id_profesor, codigo_grupo, periodo_academico, cupo_maximo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_materia, id_profesor, codigo_grupo, periodo_academico, cupo_maximo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};