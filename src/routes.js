import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showNewProjectForm } from './controllers/projects.js';
import { processNewProjectForm } from './controllers/projects.js';
import { showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { showCategoriesPage, showNewCategoryForm, showEditCategoryForm, processNewCategoryForm, processEditCategoryForm, categoryValidation } from './controllers/categories.js';
import { showAssignCategoriesForm } from './controllers/projects.js';
import { processAssignCategoriesForm } from './controllers/projects.js';
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { projectValidation } from './controllers/projects.js';
import { showCategoryDetailsPage } from './controllers/categories.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { showEditOrganizationForm } from './controllers/organizations.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { organizationValidation } from './controllers/organizations.js';
import { processEditOrganizationForm } from './controllers/organizations.js';
import { showUserRegistrationForm, processUserRegistrationForm } from './controllers/users.js';
import { showLoginForm, processLoginForm, processLogout } from './controllers/users.js';
import { requireLogin } from './controllers/users.js';
import { showDashboard } from './controllers/users.js';
import { requireRole } from './controllers/users.js';
const router = express.Router();

router.get('/', showHomePage);
// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
// Routes for new project form and submission
router.get('/new-project', requireRole('admin'), showNewProjectForm);
// Route to handle the form submission for creating a new project
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.get('/categories', showCategoriesPage);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// error-handling routes
router.get('/test-error', testErrorPage);
//Router to display the form for creating a new organization
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
//Router to handle the form submission for creating a new organization
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
// Routes for user registration
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
export default router;