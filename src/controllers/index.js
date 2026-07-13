// Importing necessary model functions (none needed for this file)
// Define any controller functions
const showHomePage = async (req, res) => {
  const title = 'Home';
  res.render('home', { title });
};
//Export any controller functions
export { showHomePage };