FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Garanta que o main é executável como módulo principal
CMD ["python", "main.py"]
