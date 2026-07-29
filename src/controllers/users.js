import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';

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

export { showUserRegistrationForm, processUserRegistrationForm, extractRegistrationName };