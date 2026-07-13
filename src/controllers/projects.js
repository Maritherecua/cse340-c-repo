//Import the necessary modules and functions
import { getAllProjects } from '../models/projects.js';

// Define the controller function to handle the request for the projects page
const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = 'Service Projects';

  res.render('projects', { title, projects });
};
// Export the controller function for use in the routes
export { showProjectsPage };