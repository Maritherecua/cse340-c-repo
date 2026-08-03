import db from './db.js';

/* =============================================
 * Add a user as a volunteer for a project
 * ============================================= */
const addVolunteer = async (userId, projectId) => {
  try {
    const sql = `
      INSERT INTO project_volunteers (user_id, project_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, project_id) DO NOTHING
      RETURNING *;
    `;
    const result = await db.query(sql, [userId, projectId]);
    return result.rows[0];
  } catch (error) {
    console.error('addVolunteer error: ' + error);
    throw error;
  }
};

/* =============================================
 * Remove a user as a volunteer from a project
 * ============================================= */
const removeVolunteer = async (userId, projectId) => {
  try {
    const sql = `
      DELETE FROM project_volunteers
      WHERE user_id = $1 AND project_id = $2
      RETURNING *;
    `;
    const result = await db.query(sql, [userId, projectId]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('removeVolunteer error: ' + error);
    throw error;
  }
};

/* =============================================
 * Get all projects a specific user has volunteered for
 * ============================================= */
const getVolunteeredProjectByUserId = async (userId) => {
  try {
    const sql = `
      SELECT p.* 
      FROM project p
      JOIN project_volunteers pv ON p.project_id = pv.project_id
      WHERE pv.user_id = $1
      ORDER BY p.project_id DESC;
    `;
    const result = await db.query(sql, [userId]);
    return result.rows;
  } catch (error) {
    console.error('getVolunteeredProjectByUserId error: ' + error);
    throw error;
  }
};

/* =============================================
 * Check if a user is currently volunteering for a specific project
 * ============================================= */
const isUserVolunteering = async (userId, projectId) => {
  try {
    const sql = `
      SELECT 1 FROM project_volunteers
      WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(sql, [userId, projectId]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('isUserVolunteering error: ' + error);
    throw error;
  }
};

export {
  addVolunteer,
  removeVolunteer,
  getVolunteeredProjectByUserId,
  isUserVolunteering,
};