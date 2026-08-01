import test from 'node:test';
import assert from 'node:assert/strict';
import ejs from 'ejs';
import { requireRole } from '../src/controllers/users.js';

const viewOptions = {
    NODE_ENV: 'test',
    isLoggedIn: true,
    flash: () => ({ success: [], error: [], warning: [], info: [] })
};

test('header shows login and logout links based on authentication state', async () => {
    const headerPath = new URL('../src/views/partials/header.ejs', import.meta.url).pathname;

    const loggedOutHtml = await ejs.renderFile(headerPath, {
        title: 'Home',
        isLoggedIn: false,
        flash: () => ({ success: [], error: [], warning: [], info: [] })
    });

    const loggedInHtml = await ejs.renderFile(headerPath, {
        title: 'Home',
        isLoggedIn: true,
        flash: () => ({ success: [], error: [], warning: [], info: [] })
    });

    assert.match(loggedOutHtml, /Register/);
    assert.match(loggedOutHtml, /Login/);
    assert.doesNotMatch(loggedOutHtml, /Logout/);
    assert.match(loggedInHtml, /Logout/);
    assert.doesNotMatch(loggedInHtml, /Login/);
    assert.doesNotMatch(loggedInHtml, /Register/);
});

test('dashboard shows the users link only for admin users', async () => {
    const dashboardPath = new URL('../src/views/dashboard.ejs', import.meta.url).pathname;

    const adminHtml = await ejs.renderFile(dashboardPath, {
        ...viewOptions,
        title: 'Dashboard',
        name: 'Admin User',
        email: 'admin@example.com',
        user: { role_name: 'admin' }
    });

    const userHtml = await ejs.renderFile(dashboardPath, {
        ...viewOptions,
        title: 'Dashboard',
        name: 'Regular User',
        email: 'user@example.com',
        user: { role_name: 'user' }
    });

    assert.match(adminHtml, /View Registered Users/);
    assert.match(adminHtml, /\/users/);
    assert.doesNotMatch(userHtml, /View Registered Users/);
    assert.doesNotMatch(userHtml, /\/users/);
});

test('users page renders registered users with name email and role', async () => {
    const usersPath = new URL('../src/views/users.ejs', import.meta.url).pathname;
    const html = await ejs.renderFile(usersPath, {
        ...viewOptions,
        title: 'Users',
        user: { role_name: 'admin' },
        users: [
            { name: 'Admin User', email: 'admin@example.com', role: 'admin' },
            { name: 'Regular User', email: 'user@example.com', role: 'user' }
        ]
    });

    assert.match(html, /<th>Name<\/th>/);
    assert.match(html, /<th>Email<\/th>/);
    assert.match(html, /<th>Role<\/th>/);
    assert.match(html, /Admin User/);
    assert.match(html, /admin@example.com/);
    assert.match(html, /admin/);
    assert.match(html, /Regular User/);
    assert.match(html, /user@example.com/);
});

test('non-admin users are redirected to the dashboard when accessing admin routes', async () => {
    const middleware = requireRole('admin');
    const flashes = [];
    let redirectedTo = null;
    let nextCalled = false;

    await middleware(
        {
            session: { user: { role_name: 'user' } },
            flash: (type, message) => {
                if (type && message) {
                    flashes.push({ type, message });
                }
            }
        },
        {
            redirect: (path) => {
                redirectedTo = path;
            }
        },
        () => {
            nextCalled = true;
        }
    );

    assert.equal(redirectedTo, '/dashboard');
    assert.equal(nextCalled, false);
    assert.deepEqual(flashes, [
        { type: 'error', message: 'You do not have permission to access this page.' }
    ]);
});
