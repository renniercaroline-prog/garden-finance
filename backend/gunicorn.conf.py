import os
import multiprocessing

# Render provides PORT environment variable
port = os.getenv("PORT", "8000")
bind = f"0.0.0.0:{port}"

# Worker configuration
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Timeout
timeout = 120
keepalive = 5

print(f"🚀 Starting server on {bind}")
print(f"👷 Workers: {workers}")

