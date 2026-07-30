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

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.userId = user.user_id ?? user.id;
            req.flash('success', 'Login successful!');
            console.log('User logged in:', user);
            return res.redirect('/');
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
const processLogout = async (req, res) => {
    // destroys the session, adds a success flash message (user logged out) and redirects to the login page
    if (req.session.userId) {
        delete req.session.userId;
    }

    req.flash('success', 'You have been logged out.');
    return res.redirect('/login');

};

export {
    showUserRegistrationForm, processUserRegistrationForm, extractRegistrationName,
    processLoginForm, showLoginForm, processLogout
};
