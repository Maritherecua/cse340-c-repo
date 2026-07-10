
import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT c.category_id, c.name, COUNT(pc.project_id) AS project_count
        FROM public.category c
        LEFT JOIN public.project_category pc ON c.category_id = pc.category_id
        GROUP BY c.category_id, c.name
        ORDER BY c.name;
    `;

    const result = await db.query(query);
    return result.rows;
}

export { getAllCategories };