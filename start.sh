#!/bin/bash

echo "🚀 Starting Patient Registration System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created with default values."
fi

# Start all services
echo "🐳 Starting all services with Docker Compose..."
docker compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Initialize database
echo "🗄️ Initializing database..."
docker exec patient_registration_db psql -U postgres -d postgres -c "
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  fullname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  countrycode TEXT NOT NULL,
  documentphoto TEXT NOT NULL,
  createdat TIMESTAMP DEFAULT NOW(),
  updatedat TIMESTAMP DEFAULT NOW()
);" 2>/dev/null || echo "Database already initialized"

echo "✅ Database initialized successfully!"

# Show logs
echo "📋 Showing application logs..."
docker compose logs -f

echo ""
echo "✅ Application is running!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
