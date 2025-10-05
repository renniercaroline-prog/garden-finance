#!/bin/bash
# Start script for Render

set -e

echo "Starting AdaHack2025 Backend..."
echo "PORT: ${PORT:-8000}"

# Run database migrations if needed
# python -m alembic upgrade head

# Start the FastAPI application
exec python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info

