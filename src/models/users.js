import db from './db.js'
import bcrypt from 'bcrypt';
const createUser = async (name, email, passwordHash) => {
    const defaultRole = 'user'; // Set the default role to 'user'
    const query = `INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
    RETURNING user_id
`;
    const queryParameters = [name, email, passwordHash, defaultRole];
    const result = await db.query(query, queryParameters);
    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }
    return result.rows[0].user_id;
};
const findUserByEmail = async (email) => {
    const query = `SELECT user_id, name, email, password_hash, role_id FROM users WHERE email = $1`;
    const queryParameters = [email];
    const result = await db.query(query, queryParameters);
    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0] || null;
};

const verifyPassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // User not found
    }
    //use verifyPassword to check if the provided password matches, if the password is correct, remove the password_hash from the user object and return the user object, if the password is incorrect, return null
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
        return null; // Password is incorrect
    }
    // Remove the password_hash from the user object before returning it
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
export { createUser, authenticateUser };