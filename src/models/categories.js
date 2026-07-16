
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
};
/* ******************************************
 * Retrieve a single category by its ID
 * ****************************************** */
const getCategoryById = async (categoryId) => {
    try {
        const query = `
            SELECT * 
            FROM public.category 
            WHERE category_id = $1;
        `;
        const result = await db.query(query, [categoryId]);
        return result.rows[0];
    } catch (error) {
        console.error("getCategoryById error: " + error);
        throw error;
    }
};
/* ******************************************
 * Retrieve all categories for a given service project
 * ****************************************** */
const getCategoriesByProjectId = async (projectId) => {
    try {
        const query = `
            SELECT c.category_id, c.name 
            FROM public.category c
            JOIN public.project_category pc ON c.category_id = pc.category_id
            WHERE pc.project_id = $1
            ORDER BY c.name;
        `;
        const result = await db.query(query, [projectId]);
        return result.rows;
    } catch (error) {
        console.error("getCategoriesByProjectId error: " + error);
        throw error;
    }
};
/* ******************************************
 * Retrieve all service projects for a given category
 * ****************************************** */
const getProjectsByCategoryId = async (categoryId) => {
    try {
        const query = `
            SELECT p.* 
            FROM public.project p
            JOIN public.project_category pc ON p.project_id = pc.project_id
            WHERE pc.category_id = $1
            ORDER BY p.title;
        `;
        const result = await db.query(query, [categoryId]);
        return result.rows;
    } catch (error) {
        console.error("getProjectsByCategoryId error: " + error);
        throw error;
    }
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId };