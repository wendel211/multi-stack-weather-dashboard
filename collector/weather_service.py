import os
import logging
import requests
from datetime import datetime
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class WeatherService:
    def __init__(self):
        self.api_url = os.getenv('WEATHER_API_URL', 'https://api.open-meteo.com/v1/forecast')
        self.latitude = float(os.getenv('CITY_LAT', '-12.97'))
        self.longitude = float(os.getenv('CITY_LON', '-38.51'))
        
        logger.info(f"🌍 Configurado para: Lat {self.latitude}, Lon {self.longitude}")
    
    def get_current_weather(self) -> Optional[Dict]:
        """
        Busca dados climáticos atuais da API Open-Meteo
        Retorna dict com: temperature, humidity, wind_speed, condition, timestamp
        """
        try:
            # Parâmetros para a API Open-Meteo
            params = {
                'latitude': self.latitude,
                'longitude': self.longitude,
                'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
                'timezone': 'auto'
            }
            
            logger.info(f"📡 Fazendo requisição para Open-Meteo...")
            response = requests.get(self.api_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            current = data.get('current', {})
            
            # Mapeia o weather_code para condição legível
            weather_code = current.get('weather_code', 0)
            condition = self._map_weather_code(weather_code)
            
            weather_data = {
                'temperature': current.get('temperature_2m', 0),
                'humidity': current.get('relative_humidity_2m', 0),
                'wind_speed': current.get('wind_speed_10m', 0),
                'condition': condition,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            logger.info(f"✅ Dados obtidos: Temp={weather_data['temperature']}°C, "
                       f"Umidade={weather_data['humidity']}%, "
                       f"Vento={weather_data['wind_speed']}km/h, "
                       f"Condição={weather_data['condition']}")
            
            return weather_data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Erro ao buscar dados climáticos: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"❌ Erro inesperado: {str(e)}")
            return None
    
    def _map_weather_code(self, code: int) -> str:
        """
        Mapeia códigos WMO Weather para descrições em texto
        Fonte: https://open-meteo.com/en/docs
        """
        weather_codes = {
            0: 'Clear',
            1: 'Mainly Clear',
            2: 'Partly Cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing Rime Fog',
            51: 'Light Drizzle',
            53: 'Moderate Drizzle',
            55: 'Dense Drizzle',
            61: 'Slight Rain',
            63: 'Moderate Rain',
            65: 'Heavy Rain',
            71: 'Slight Snow',
            73: 'Moderate Snow',
            75: 'Heavy Snow',
            77: 'Snow Grains',
            80: 'Slight Rain Showers',
            81: 'Moderate Rain Showers',
            82: 'Violent Rain Showers',
            85: 'Slight Snow Showers',
            86: 'Heavy Snow Showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with Slight Hail',
            99: 'Thunderstorm with Heavy Hail'
        }
        
        return weather_codes.get(code, 'Unknown')