CREATE TABLE IF NOT EXISTS organization (
organization_id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
contact_email VARCHAR(255) NOT NULL,
logo_filename VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS organization_name_key ON organization (name);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS project (
project_id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
organization_id INTEGER NOT NULL,
location VARCHAR(150) NOT NULL,
date DATE NOT NULL,
PRIMARY KEY (project_id),
--Foreign key constraint to link projects to their respective organization table.
FOREIGN KEY (organization_id) 
REFERENCES organization(organization_id) 
ON DELETE CASCADE
);
INSERT INTO project ( project_id, organization_id, title, description,location, date)
VALUES
-- BrightFuture Builders (ID 1)

(1, 'Community Center Renovation', 'Repairing the roof and walls', 'Downtown Plaza', '2026-09-15'),

(1, 'Housing Assistance', 'Building homes for families', 'East Side', '2026-10-01'),

(1, 'School Playground Build', 'Installing new safety equipment', 'Central Elementary', '2026-10-20'),

(1, 'Library Expansion', 'Constructing new reading rooms', 'City Library', '2026-11-15'),

(1, 'Park Bench Installation', 'Building custom wooden benches', 'West Park', '2026-08-20'),
 
-- GreenHarvest Growers (ID 2)

(2, 'Urban Garden Plot', 'Clearing land for vegetables', 'North District', '2026-08-30'),

(2, 'Tree Planting Initiative', 'Planting 50 native trees', 'River Basin', '2026-09-10'),

(2, 'Compost Education', 'Teaching residents to compost', 'Community Center', '2026-09-15'),

(2, 'Greenhouse Repair', 'Maintaining the structure', 'Botanical Garden', '2026-10-15'),

(2, 'Seed Exchange Fair', 'Community seed swap', 'Town Square', '2026-11-20'),
 
-- UnityServe Volunteers (ID 3)

(3, 'Weekly Soup Kitchen', 'Serving meals to the homeless', 'Main Street', '2026-12-31'),

(3, 'Elderly Tech Support', 'Teaching smartphone usage', 'Senior Center', '2026-09-26'),

(3, 'After-School Tutoring', 'Math and reading help', 'Youth Club', '2026-12-15'),

(3, 'Neighborhood Clean-up', 'Picking up litter', 'Downtown Area', '2026-10-12'),

(3, 'Charity Gala Support', 'Managing logistics', 'Grand Hotel', '2026-12-05');
 
 CREATE TABLE IF NOT EXISTS Category (
category_id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE,
CONSTRAINT categories_pk PRIMARY KEY (category_id)
);
-- Create a junction table to link projects and categories (many-to-many relationship)
CREATE TABLE IF NOT EXISTS project_category (
project_id INT NOT NULL,
category_id INT NOT NULL,
CONSTRAINT project_categories_pk PRIMARY KEY (project_id, category_id),
CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
);
INSERT INTO Category (name) VALUES

('Education & Tutoring'),
('Food & Hunger Relief'),
('Environmental & Clean-up'),
('Community Service');
INSERT INTO project_category (project_id, category_id) VALUES
(1, 4), -- Community Center Renovation - Community Service
(2, 1), -- Housing Assistance - Education & Tutoring
(3, 1), -- School Playground Build - Education & Tutoring
(4, 4), -- Library Expansion - Community Service
(5, 3), -- Park Bench Installation - Environmental & Clean-up
(6, 1), -- Urban Garden Plot - Education & Tutoring
(7, 3), -- Tree Planting Initiative - Environmental & Clean-up
(8, 1), -- Compost Education - Education & Tutoring
(9, 4), -- Greenhouse Repair - Community Service
(10, 1), -- Seed Exchange Fair - Education & Tutoring
(11, 2), -- Weekly Soup Kitchen - Food & Hunger Relief
(12, 1), -- Elderly Tech Support - Education & Tutoring
(13, 1), -- After-School Tutoring - Education & Tutoring
(14, 3), -- Neighborhood Clean-up - Environmental & Clean-up
(15, 4); -- Charity Gala Support - Community Service


 

