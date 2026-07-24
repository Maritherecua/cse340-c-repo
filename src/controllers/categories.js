//import needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';
//Define controller functions for categories
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Service Categories';
  res.render('categories', { title, categories });
};
//Create a new controller function for the category details page
const showCategoryDetailsPage = async (req, res,next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    const projects = await getProjectsByCategoryId(categoryId);
    const title = `Category: ${category.name}`;
    res.render('category-details', { title, category, projects });
  } catch (error) {
    //Pass the error to the Express global error handler
    next(error);
  }
};
const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByServiceProjectId(projectId);
  const title = 'Assign Categories to Project';
  res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

//Export controller functions
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };