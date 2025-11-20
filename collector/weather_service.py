import requests
import os
from datetime import datetime

class WeatherService:
    def __init__(self):
        self.lat = os.getenv("CITY_LAT")
        self.lon = os.getenv("CITY_LON")
        self.api = os.getenv("WEATHER_API", "open-meteo")

    def fetch_weather(self):
        """Busca dados de clima da API escolhida (Open-Meteo por padrão)."""

        url = (
            "https://api.open-meteo.com/v1/forecast?"
            f"latitude={self.lat}&longitude={self.lon}"
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
        )

        response = requests.get(url)
        data = response.json()

        current = data["current"]

        return {
            "temperature": current["temperature_2m"],
            "humidity": current["relative_humidity_2m"],
            "wind_speed": current["wind_speed_10m"],
            "condition": "unknown",  # Open-Meteo não dá condição textual
            "timestamp": datetime.utcnow().isoformat(),
        }
