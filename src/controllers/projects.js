//Import the necessary modules and functions
import { body, validationResult } from 'express-validator';
//import { getAllProjects } from '../models/projects.js';
import { getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getAllCategories, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';
import { createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
// Define your validation rules array
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];
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
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'Project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'An error occurred while creating the project.');
        res.redirect('/new-project');
    }
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }
};

const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).render('assign-categories', {
                title: 'Project Not Found',
                projectId,
                projectDetails: null,
                categories: [],
                assignedCategories: []
            });
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);
        const assignedCategoryIds = assignedCategories.map((category) => category.category_id);

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            projectId,
            projectDetails,
            categories,
            assignedCategories: assignedCategoryIds
        });
    } catch (error) {
        console.error('Error loading assign categories form:', error);
        res.status(500).send('An error occurred while loading the form.');
    }
};

const processAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];
        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds.map((id) => Number(id))
            : [Number(selectedCategoryIds)];

        await updateCategoryAssignments(projectId, categoryIdsArray);
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating categories:', error);
        req.flash('error', 'An error occurred while updating categories.');
        res.redirect(`/assign-categories/${req.params.projectId}`);
    }
};

// Export the controller function for use in the routes
export {
    showProjectsPage, showProjectDetailsPage,
    showNewProjectForm, processNewProjectForm, projectValidation,
    showAssignCategoriesForm, processAssignCategoriesForm
};