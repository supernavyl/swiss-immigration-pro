#!/bin/bash
# Sync dev environment with latest VPS deployment

set -e

echo "🔄 Syncing Swiss Immigration Pro dev environment..."
echo ""

# Step 1: Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main
echo "✓ Git pull complete"
echo ""

# Step 2: Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd swiss-immigration-pro
npm install
echo "✓ Frontend deps installed"
echo ""

# Step 3: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../backend
pip install -r requirements.txt
echo "✓ Backend deps installed"
echo ""

# Step 4: Rebuild Docker containers
echo "🐳 Rebuilding Docker containers..."
cd ..
docker-compose build --parallel
echo "✓ Docker build complete"
echo ""

# Step 5: Start services
echo "🚀 Starting services..."
docker-compose up -d
echo "✓ Services started"
echo ""

# Step 6: Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T backend alembic upgrade head
echo "✓ Migrations complete"
echo ""

# Step 7: Check service health
echo "🏥 Checking service health..."
docker-compose ps
echo ""

echo "✅ Dev environment synced with latest VPS deployment!"
echo ""
echo "Access your dev site at:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
