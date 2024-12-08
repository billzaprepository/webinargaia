#!/bin/bash

# Wait for MinIO to be ready
echo "Waiting for MinIO to be ready..."
until curl -sf "http://minio:9000/minio/health/live"; do
  echo "MinIO is not ready - sleeping"
  sleep 1
done

echo "MinIO is ready! Starting application..."
exec npm start