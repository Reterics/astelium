# Astelium

Astelium is a unified Task & Project Management and CRM system built as a monorepo with a Laravel backend and a React/Vite frontend using Inertia.js and TailwindCSS. The project is containerized with Docker and Docker Compose.

## Overview

- **Backend:** Laravel with Fortify (for authentication/MFA), Inertia.js, and MySQL.
- **Frontend:** React with TypeScript (TSX), Vite, and TailwindCSS.
- **Containerization:** Docker and Docker Compose for development and deployment.

## Repository Structure

- monorepo/
- ├── backend/ _# Laravel application_
- ├── frontend/ _# React SPA with Vite and TailwindCSS_
- ├── docker/ _# Docker configuration files (Dockerfile.backend, Dockerfile.frontend)_ 
- ├── docker-compose.yml _# Docker Compose configuration file_ 
- ├── docs/ _# Additional documentation_ 
- └── README.md _# Project overview and instructions_


## Setup Instructions

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (WSL2 integration recommended on Windows)
- [Git](https://git-scm.com/)
- [Composer](https://getcomposer.org/)
- [Node.js & npm](https://nodejs.org/)

### Environment Configuration

1. **Backend Environment Variables:**

   Copy the provided `.env.example` in the `backend/` folder to create your local `.env` file. Ensure the database credentials match the ones defined in the `docker-compose.yml`:

   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=laravel_db
   DB_USERNAME=laravel_user
   DB_PASSWORD=laravel_pass
    ```

1. **Frontend Environment Variables:**

   In the frontend/ folder, create a .env file if needed. Typically, you might include variables such as the API base URL or other configuration settings. For example:
   ```dotenv
   VITE_API_BASE_URL=http://localhost:9000
    ```

### Running the Application

1. **Build and Start Containers:**

   From the repository root, run:

   ```bash
   docker-compose up --build
   ```

This command builds and starts the backend, MySQL, and (if configured) frontend containers.

2. **Access the Application:**
   - **Laravel Backend**: Accessible through PHP-FPM (usually behind an Nginx proxy; adjust your proxy settings as needed).
   - **React/Vite Frontend**: Accessible at http://localhost:3000 if the frontend container is used.

3. **Database Migrations:**

   Once the containers are running, execute Laravel migrations from within the backend container:

   ```bash
   docker-compose exec backend php artisan migrate
   ```


### Running the Application

 - **Backend Tests:**

   Run within the backend container:

   ```bash
   docker-compose exec backend php artisan test
   ```
   
 - **Frontend Tests:**

   Run inside the frontend/ folder:

   ```bash
   npm run test
   ```

