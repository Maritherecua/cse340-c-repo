//Importing necessary modul functions (none needed for this file)
// Define any controller functions
// Test route for 500 errors
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};
//Exporting controller functions
export { testErrorPage };