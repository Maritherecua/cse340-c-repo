//import needed model functions
import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, createCategory, updateCategory, getProjectsByCategoryId, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Category name must be at most 100 characters')
];

//Define controller functions for categories
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Service Categories';
  res.render('categories', { title, categories });
};
//Create a new controller function for the category details page
const showCategoryDetailsPage = async (req, res, next) => {
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
const showNewCategoryForm = async (req, res) => {
  const title = 'Add New Category';
  res.render('new-category', { title });
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    return res.status(404).send('Category not found');
  }

  const title = 'Edit Category';
  res.render('edit-category', { title, category });
};

const processNewCategoryForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => req.flash('error', error.msg));
    return res.redirect('/new-category');
  }

  const { name } = req.body;
  const categoryId = await createCategory(name);
  req.flash('success', 'Category created successfully.');
  res.redirect(`/category/${categoryId}`);
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => req.flash('error', error.msg));
    return res.redirect(`/edit-category/${categoryId}`);
  }

  const { name } = req.body;
  await updateCategory(categoryId, name);
  req.flash('success', 'Category updated successfully.');
  res.redirect(`/category/${categoryId}`);
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);
  const assignedCategoryIds = assignedCategories.map((category) => category.category_id);
  const title = 'Assign Categories to Project';
  res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories: assignedCategoryIds });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);
  req.flash('success', 'Categories updated successfully.');
  res.redirect(`/project/${projectId}`);
};

//Export controller functions
export { showCategoriesPage, showCategoryDetailsPage, showNewCategoryForm, showEditCategoryForm, processNewCategoryForm, processEditCategoryForm, categoryValidation, showAssignCategoriesForm, processAssignCategoriesForm };