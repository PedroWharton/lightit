#!/bin/bash

echo "🚀 Setting up Patient Registration System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created. Please update .env with your configuration."
fi

# Start database service
echo "🐘 Starting PostgreSQL..."
docker compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Set up database
echo "🗄️ Setting up database..."
cd backend
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'password'
});

const createTable = \`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    fullname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    countrycode TEXT NOT NULL,
    documentphoto TEXT NOT NULL,
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
  );
\`;

pool.query(createTable)
  .then(() => {
    console.log('✅ Database table created successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database setup failed:', err.message);
    process.exit(1);
  });
"
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Or with Docker:"
echo "  docker-compose up"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
