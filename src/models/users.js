import db from './db.js'
const createuser = async (name, email, passwordHash) => {
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

export { createUser };