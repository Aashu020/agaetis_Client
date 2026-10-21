Agaetis Technologies – Employee Management System

A full-stack Employee Management System built with React, Vite, Node.js, Express, TypeScript, and PostgreSQL (Supabase). The application allows users to manage employee records with search functionality, pagination, and a responsive user interface.

 Live Demo

Live Application: https://agaetistechnologies.netlify.app/

 GitHub Repositories
Frontend: https://github.com/Aashu020/agaetis_Client
Backend: https://github.com/Aashu020/agaetis-server

** Tech Stack
Frontend,
React,
Vite,
JavaScript,
Axios,
CSS,

 *Backend
Node.js,
Express.js,
TypeScript,
REST API,

 *Database
PostgreSQL,
Supabase,

 *Deployment
Frontend: Netlify,
Backend: Render

Database: Postgres (used:Supabase. -PgAdmin was locked beacause of the last candidate so used supabase for less time consumption)



** Features Implemented

Employee Management: Retrieve, create, update, and delete employee records.
Search Functionality: Filter employees by name.
Pagination: Display employee records in manageable pages as the list grows.
Responsive UI: A clean interface for viewing and managing employee information.
REST API: Backend endpoints for employee data operations.
Input Validation: Validate employee details before processing requests.
Error Handling: Handle invalid inputs and API/database errors.
Database Integration: Store and retrieve employee records using PostgreSQL through Supabase.

 **Project Structure
*Frontend
agaetis_Client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   
├── public/
├── .env
├── package.json
└── vite.config.js

Backend
agaetis-server/
├── controllers/
│   └── employee.controller.ts
├── models/
│   └── employee.model.ts
├── index.ts
├── tsconfig.json
├── package.json
└── ...


Note: The directory structures above are illustrative. Actual files and folders may differ.

 **Getting Started

Follow these steps to run the frontend and backend locally.

Make sure you have installed:

Node.js and npm
Git
A Supabase project with the required PostgreSQL database and configuration
1. Clone the repositories

Clone the frontend:

git clone https://github.com/Aashu020/agaetis_Client.git
cd agaetis_Client
npm install


Clone the backend in a separate terminal:

git clone https://github.com/Aashu020/agaetis-server.git
cd agaetis-server
npm install

2. Configure environment variables

Create a .env file in the backend directory and add the environment variables required by your application.

For example:

PORT=5000


Add your Supabase/database credentials and other required settings using the variable names expected by your backend code. Do not commit secrets to GitHub.

For the frontend, create a .env file in the frontend directory:

VITE_API_URL=http://localhost:5000/api for live VITE_API_URL=https://agaetis-server.onrender.com/api


For local development, this assumes your backend runs on port 5000 and exposes employee routes under /api. Adjust the URL if your configuration differs.

For production, the frontend API URL is configured to use the deployed Render backend.

3. Run the backend

Open a terminal in the backend directory and execute:

npm run dev


The backend will start using the development script configured in package.json.

4. Run the frontend

Open another terminal in the frontend directory and execute:

npm run dev


Vite will provide a local development URL, typically:

http://localhost:5173


Open the URL shown in your terminal to access the application.

** API Overview

The backend exposes REST API endpoints for employee management.

Method	Endpoint	Description
GET	/api/employees	Retrieve employees with pagination and search
GET	/api/employees/:id	Retrieve an employee by ID
POST	/api/employees	Create an employee
PUT	/api/employees/:id	Update an employee
DELETE	/api/employees/:id	Delete an employee

The employee listing endpoint supports query parameters such as:

/api/employees?page=1&limit=5&search=


The exact routes depend on the backend's Express route configuration.

 **Database

The application uses PostgreSQL hosted on Supabase.

Supabase was used because the previously available database access was locked by the previous candidate. The application was configured to use Supabase for database connectivity.

Database credentials and connection settings should be stored securely in environment variables rather than committed to the repository.

 **Deployment
Frontend: Deployed on Netlify.
Backend: Deployed on Render.
Database: Hosted on Supabase.

The frontend communicates with the deployed backend through its API URL.

 **Author
Asif Nadaf
GitHub: https://github.com/Aashu020

