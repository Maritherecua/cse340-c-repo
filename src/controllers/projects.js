//Import the necessary modules and functions
//import { getAllProjects } from '../models/projects.js';
import { getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
//Create the constant for the controller function to handle the request for the projects page. This function will call the getAllProjects function from the model to retrieve all projects from the database, and then render the 'projects' view, passing the title and the list of projects as data.
const NUMBER_OF_UPCOMING_PROJECTS = 5;
//Update the controller function TO USE THE getUpcomingProjects MODEL FUNCTION INSTEAD OF getAllProjects. THIS WILL RETRIEVE ONLY THE UPCOMING PROJECTS TO DISPLAY ON THE PROJECTS PAGE.
const showProjectsPage = async (req, res) => {
    try {
      // Call the getUpcomingProjects function from the model, passing the constant for the number of upcoming projects to retrieve.
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        //update the title to reflect that these are upcoming service projects.
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('An error occurred while fetching projects.');
    }
};
//Create a new controller function to handle the request for a specific project details page. This function will accept a project ID as a parameter, call the getProjectDetails function from the model to retrieve the details of that project from the database, and then render the 'project-details' view, passing the project details as data.
const showProjectDetailsPage = async (req, res) => {
    try {
        const Id = req.params.id; // Extracts the ID from the URL
        //Call the model function to get project details
        const project = await getProjectDetails(Id); // Call the model function to get project details
        if (!project) {
            return res.status(404).render('project', { title: 'Project Not Found', project: null, categories: [] }); // Handle case where project is not found
        }
        // 2. Retrieve the categories for this project using your new model function
        const categories = await getCategoriesByProjectId(Id);
        //Render the view project.ejs with the project details. Pass the project title as the title for the view, and the project details as data to be displayed in the view. 
            res.render('project', { title: project.title, project, categories }); // Render the view with project details and categories
        }
        
     catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        res.status(500).send('An error occurred.');
    }
};
//Function to get a list of all organization from the db, and renders the new-project view, passing in the page title and the list of organizations to populate the dropsown menu.
const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Project';
        res.render('new-project', { title, organizations });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('An error occurred while fetching organizations.');
    }
};
//Function to extract the project data from the form using req.body.
const processNewProjectForm = async (req, res) => {
    const { title, description, location, date, organizationId } = req.body;
    try {
        //Create the new project in the database using the createProject model function, passing in the extracted data. This function will return the ID of the newly created project.
        const newProjectId = await createProject( title, description, location, date, organizationId);

        req.flash('success', 'Project created successfully!');
        res.redirect(`/projects/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'An error occurred while creating the project.');
        res.redirect('/new-project');
    }
};

// Export the controller function for use in the routes
export { showProjectsPage, showProjectDetailsPage, 
    showNewProjectForm, processNewProjectForm };