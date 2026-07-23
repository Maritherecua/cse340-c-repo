import db from './db.js'

const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.date,
               o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
          ON p.organization_id = o.organization_id;
    `;

    const result = await db.query(query);
    return result.rows;
};
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};
// This function retrieves a limit number of upcoming projects from the database. At this point the controller will pass 5 as the number of projects to retrieve, but the function can accept any number.
// This function queries the database for service projects with a date greater than or equal to the current date, ordered by date in ascending order, and limited to number_of_projects results.
const getUpcomingProjects = async (limit) => {
    const query = `
        SELECT p.project_id, p.title, p.description,
               p.date, p.location, p.organization_id, o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    const queryParams = [limit];
    const result = await db.query(query, queryParams);

    return result.rows;
};
//This function retrieves a single service project by its ID. Accepts a project ID as a parameter and queries the database for the project with that ID, returning the project details.
const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description,
               p.date, p.location, p.organization_id, o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);
    return result.rows[0]; // Returns the first (and only) project found with the given ID.
};
//Function to insert new service project into the database. Accepts project details as parameters and inserts a new record into the project table.
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }
    return result.rows[0].project_id;

}
// Export the model functions.
export {
    getAllProjects, getProjectsByOrganizationId,
    getUpcomingProjects, getProjectDetails, createProject
};