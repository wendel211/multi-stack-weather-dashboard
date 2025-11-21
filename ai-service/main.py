import os
import requests
from fastapi import FastAPI
from dotenv import load_dotenv
from utils.prompt import build_insight_prompt
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
NEST_API_URL = os.getenv("NEST_API_URL", "http://api:3000")

app = FastAPI()
client = OpenAI(api_key=OPENAI_API_KEY)

@app.get("/health")
def health():
    return {"status": "AI service ok"}

@app.post("/generate-insights")
def generate_insights():
    # buscar dados do NestJS
    r = requests.get(f"{NEST_API_URL}/weather/logs")
    weather_data = r.json()

    prompt = build_insight_prompt(weather_data)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é um analisador climático especializado."},
            {"role": "user", "content": prompt}
        ],
    )

    ai_text = response.choices[0].message["content"]

    return {"insights": ai_text}
