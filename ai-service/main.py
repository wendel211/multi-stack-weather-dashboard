from fastapi import FastAPI
from pydantic import BaseModel
import httpx
import os

app = FastAPI()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
NEST_API_URL = os.getenv("NEST_API_URL", "http://api:3000")

class InsightRequest(BaseModel):
    temperature: float
    humidity: float
    wind: float
    condition: str

@app.post("/generate")
async def generate_insight(data: InsightRequest):
    if not OPENAI_API_KEY:
        return {"error": "Faltando variável OPENAI_API_KEY"}

    prompt = (
        f"Analise os seguintes dados climáticos:\n"
        f"Temperatura: {data.temperature}°C\n"
        f"Umidade: {data.humidity}%\n"
        f"Vento: {data.wind} km/h\n"
        f"Condição: {data.condition}\n\n"
        f"Crie um insight curto e útil."
    )

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )

        result = response.json()
        return {"message": result["choices"][0]["message"]["content"]}

@app.get("/health")
def health():
    return {"status": "ok"}
