# Astelium

[![build](https://github.com/Reterics/astelium/actions/workflows/build.yml/badge.svg)](https://github.com/Reterics/astelium/actions/workflows/build.yml)


Astelium is a unified Task & Project Management and CRM system built as a monorepo with a Laravel backend and a React/Vite frontend using Inertia.js and TailwindCSS. The project is containerized with Docker and Docker Compose.

## Overview

- **Backend:** Laravel with Fortify (for authentication/MFA), Inertia.js, and MySQL.
- **Frontend:** React with TypeScript, Vite, and TailwindCSS.
- **Containerization:** Docker and Docker Compose for development and deployment.

## Repository Structure

```
monorepo/
├── backend/            # Laravel application
├── frontend/           # React SPA with Vite and TailwindCSS
├── docker/             # Docker configuration files (Dockerfile.backend, Dockerfile.frontend)
├── docker-compose.yml  # Docker Compose configuration file
├── docs/               # Additional documentation
└── README.md           # Project overview and instructions
```

## Setup Instructions

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (WSL2 integration recommended on Windows)
- [Git](https://git-scm.com/)
- [Composer](https://getcomposer.org/)
- [Node.js & npm](https://nodejs.org/)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. Environment Configuration

#### Backend Environment Variables

Copy the provided `.env.example` file in the `backend/` folder to create your local `.env` file:

```bash
cp backend/.env.example backend/.env
```

Ensure the database credentials match those defined in `docker-compose.yml`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_pass
```

#### Frontend Environment Variables

In the `frontend/` folder, create a `.env` file if needed. For example:

```dotenv
VITE_DEV_SERVER_URL=http://localhost:5173/
```

### 3. Install PHP Dependencies

If you're using Docker Compose, run:

```bash
docker-compose run --rm app composer install
```

Otherwise, run:

```bash
composer install
```

### 4. Install Frontend Dependencies

If using Docker Compose, run:

```bash
docker-compose run --rm app npm install
```

Or locally (from the `frontend/` folder):

```bash
npm install
```

### 5. Build Frontend Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

### Running the Application

#### Using Docker Compose

Start the application and its services with:

```bash
docker-compose up -d
```

This will start your Laravel application, MySQL, and any other services defined in `docker-compose.yml`.

#### Without Docker Compose

Ensure your MySQL database is running and your `.env` file is configured correctly, then start the Laravel development server (from the `backend/` folder):

```bash
php artisan serve
```

### Database Setup

#### 1. Run Migrations

Set up the database schema by running:

```bash
php artisan migrate
```

If using Docker Compose:

```bash
docker-compose run --rm app php artisan migrate
```

#### 2. Seed the Database

Seed the database with default data, including a default admin user:

```bash
php artisan db:seed
```

Or with Docker Compose:

```bash
docker-compose run --rm app php artisan db:seed
```

### Default User Data

The seeder creates a default admin user with the following credentials:

- **Email:** admin@example.com
- **Password:** securepassword

Adjust these values in `database/seeders/AdminUserSeeder.php` if needed.

### Additional Notes

- **Docker Networking:** Ensure that `DB_HOST` in your `.env` is set to the correct service name (e.g., `mysql`) so that Laravel can connect to the MySQL container.
- **Clearing Configuration Cache:** If you make changes to your `.env` file, clear Laravel's configuration cache:

```bash
php artisan config:clear
```

- **Frontend Development:** If you experience issues with the frontend, verify that the Vite development server is running.

### Troubleshooting

- **Database Connection Issues:**  
  Double-check your `.env` settings. The `DB_HOST` should be the name of the MySQL service (e.g., `mysql`) when using Docker Compose.

- **Cache Problems:**  
  Clear caches using the following commands:

```bash
php artisan config:clear
php artisan cache:clear
```
