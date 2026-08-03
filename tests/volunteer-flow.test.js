import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ejs from 'ejs';

const headerMessages = () => ({ success: [], error: [], warning: [], info: [] });
const projectPath = new URL('../src/views/project.ejs', import.meta.url).pathname;
const dashboardPath = new URL('../src/views/dashboard.ejs', import.meta.url).pathname;
const routesPath = new URL('../src/routes.js', import.meta.url).pathname;

const baseProjectViewData = {
    title: 'Project',
    NODE_ENV: 'test',
    flash: () => headerMessages(),
    user: { role_name: 'user' },
    project: {
        project_id: 12,
        title: 'Neighborhood Clean-up',
        description: 'Pick up litter in the neighborhood.',
        date: '2026-10-12',
        location: 'Downtown Area',
        organization_id: 3,
        organization_name: 'UnityServe Volunteers'
    },
    categories: []
};

test('project page hides volunteer controls when user is logged out', async () => {
    const html = await ejs.renderFile(projectPath, {
        ...baseProjectViewData,
        isLoggedIn: false,
        isVolunteering: false
    });

    assert.doesNotMatch(html, /Volunteer for this project/i);
    assert.doesNotMatch(html, /Remove yourself as a volunteer/i);
});

test('project page shows volunteer POST form when logged in and not volunteering', async () => {
    const html = await ejs.renderFile(projectPath, {
        ...baseProjectViewData,
        isLoggedIn: true,
        isVolunteering: false
    });

    assert.match(html, /form action="\/project\/12\/volunteer"\s+method="POST"/i);
    assert.match(html, /Volunteer for this project/i);
});

test('project page shows unvolunteer POST form when logged in and already volunteering', async () => {
    const html = await ejs.renderFile(projectPath, {
        ...baseProjectViewData,
        isLoggedIn: true,
        isVolunteering: true
    });

    assert.match(html, /You are volunteering for this project/i);
    assert.match(html, /form action="\/project\/12\/unvolunteer" method="POST"/i);
    assert.match(html, /Remove yourself as a volunteer/i);
});

test('dashboard shows volunteered projects with POST remove action', async () => {
    const html = await ejs.renderFile(dashboardPath, {
        title: 'Dashboard',
        NODE_ENV: 'test',
        name: 'Test User',
        email: 'user@example.com',
        isLoggedIn: true,
        flash: () => headerMessages(),
        user: { role_name: 'user' },
        volunteeredProjects: [
            { project_id: 10, title: 'Seed Exchange Fair', date: '2026-11-20' },
            { project_id: 11, title: 'Weekly Soup Kitchen', date: '2026-12-31' }
        ]
    });

    assert.match(html, /Seed Exchange Fair/);
    assert.match(html, /Weekly Soup Kitchen/);
    assert.match(html, /form action="\/dashboard\/unvolunteer\/10"\s+method="POST"/i);
    assert.match(html, /form action="\/dashboard\/unvolunteer\/11"\s+method="POST"/i);
});

test('dashboard shows empty-state message when no volunteered projects exist', async () => {
    const html = await ejs.renderFile(dashboardPath, {
        title: 'Dashboard',
        NODE_ENV: 'test',
        name: 'Test User',
        email: 'user@example.com',
        isLoggedIn: true,
        flash: () => headerMessages(),
        user: { role_name: 'user' },
        volunteeredProjects: []
    });

    assert.match(html, /You have not signed up to volunteer for any projects yet\./);
});

test('routes protect volunteer actions with requireLogin and POST', async () => {
    const routesSource = await fs.readFile(routesPath, 'utf8');

    assert.match(
        routesSource,
        /router\.post\('\/project\/:id\/volunteer',\s*requireLogin,\s*addProjectVolunteer\);/
    );
    assert.match(
        routesSource,
        /router\.post\('\/project\/:id\/unvolunteer',\s*requireLogin,\s*removeProjectVolunteer\);/
    );
    assert.match(
        routesSource,
        /router\.post\('\/dashboard\/unvolunteer\/:id',\s*requireLogin,\s*removeDashboardVolunteer\);/
    );

    assert.doesNotMatch(routesSource, /router\.get\('\/project\/:id\/volunteer'/);
    assert.doesNotMatch(routesSource, /router\.get\('\/project\/:id\/unvolunteer'/);
    assert.doesNotMatch(routesSource, /router\.get\('\/dashboard\/unvolunteer\/:id'/);
});
