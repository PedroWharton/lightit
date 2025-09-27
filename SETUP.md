# Quick Setup Guide

## One-Command Setup

After cloning the repository, simply run:

```bash
./start.sh
```

This single command will:

- ✅ Create environment file with default values
- ✅ Start PostgreSQL database
- ✅ Build and start backend API
- ✅ Build and start frontend application
- ✅ Set up database tables automatically

## What You Get

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: PostgreSQL on localhost:5432

## Alternative Setup Methods

### Method 1: Using npm scripts

```bash
npm start
```

### Method 2: Manual Docker Compose

```bash
docker compose up --build
```

### Method 3: Local development

```bash
# Start database only
docker compose up -d postgres

# Start backend and frontend locally
npm run dev
```

## Prerequisites

- Docker and Docker Compose
- Git

That's it! No Node.js installation required - everything runs in Docker containers.

## Troubleshooting

### If Docker is not running:

```bash
# Start Docker Desktop and try again
./start.sh
```

### If ports are already in use:

```bash
# Stop existing services
docker compose down

# Start fresh
./start.sh
```

### To reset everything:

```bash
# Stop and remove all containers/volumes
docker compose down -v

# Start fresh
./start.sh
```

## Environment Configuration

The application uses default values for development. To customize:

1. Edit `.env` file (created automatically)
2. Update email settings for testing
3. Restart with `./start.sh`
