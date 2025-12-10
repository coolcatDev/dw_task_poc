FROM python:3.11-slim
WORKDIR /app

# Install dependencies first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code (used in both dev and prod)
COPY ./app /app

# CMD for production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
