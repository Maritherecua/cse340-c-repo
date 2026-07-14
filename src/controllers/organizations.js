// Import necessary modules
import { getAllOrganizations } from '../models/organizations.js';
// Controller function to handle the request for the organizations page
const showOrganizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Our Partner Organizations';

  res.render('organizations', { title, organizations });
};
// Export the controller function
export { showOrganizationsPage };
