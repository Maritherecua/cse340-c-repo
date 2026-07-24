
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
 * Retrieve a single category by its ID */
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

const createCategory = async (name) => {
    try {
        const query = `
            INSERT INTO public.category (name)
            VALUES ($1)
            RETURNING category_id;
        `;
        const result = await db.query(query, [name]);
        return result.rows[0].category_id;
    } catch (error) {
        console.error("createCategory error: " + error);
        throw error;
    }
};

const updateCategory = async (categoryId, name) => {
    try {
        const query = `
            UPDATE public.category
            SET name = $1
            WHERE category_id = $2;
        `;
        await db.query(query, [name, categoryId]);
    } catch (error) {
        console.error("updateCategory error: " + error);
        throw error;
    }
};
/* ******************************************
 * Retrieve all categories for a given service project*/
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
 * Retrieve all service projects for a given category */
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
const assignCategoryToProject = async (categoryId, projectId) => {

    const query = `
            INSERT INTO project_category (category_id, project_id)
            VALUES ($1, $2);
        `;
    await db.query(query, [categoryId, projectId]);
}
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
            DELETE FROM project_category
            WHERE project_id = $1;
        `;
    await db.query(deleteQuery, [projectId]);

    // Then, insert the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export {
    getAllCategories, getCategoryById, createCategory, updateCategory, getCategoriesByProjectId,
    getProjectsByCategoryId, updateCategoryAssignments
};