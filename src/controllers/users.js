import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
import { authenticateUser } from '../models/users.js';

const extractRegistrationName = (body = {}) => {
    if (body.name && body.name.trim()) return body.name.trim();
    if (body.firstName && body.firstName.trim()) return body.firstName.trim();
    if (body.username && body.username.trim()) return body.username.trim();
    return 'User';
};

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { email, password } = req.body;
    const name = extractRegistrationName(req.body);

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/');
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        return res.redirect('/register');
    }
};
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};
/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
// Function factory to create middleware that checks for a specific role
const requireRole = (role) => {
    // The returned function is the actual middleware Express will execute later
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            req.session.userId = user.user_id ?? user.id;
            req.flash('success', 'Login successful!');
            console.log('User logged in:', user);
            //Redirect to the dashboard after successful login
            return res.redirect('/dashboard');
        }
        // If authentication fails, redirect back to the login page (function returns null)
        req.flash('error', 'Invalid email or password. Please try again.');
        return res.redirect('/login');
    }
    catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
};
const requireLogin = (req, res, next) => {
    if (!req.session || (!req.session.user && !req.session.userId)) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};
const processLogout = async (req, res) => {
    // destroys the session, adds a success flash message (user logged out) and redirects to the login page
    if (req.session.user) {
        delete req.session.user;
    }
    if (req.session.userId) {
        delete req.session.userId;
    }

    req.flash('success', 'You have been logged out.');
    return res.redirect('/login');

};
const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

export {
    showUserRegistrationForm, processUserRegistrationForm, extractRegistrationName,
    processLoginForm, showLoginForm, processLogout, requireLogin, showDashboard, requireRole
};
