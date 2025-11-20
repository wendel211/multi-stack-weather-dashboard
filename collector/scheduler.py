import schedule
import time
from weather_service import WeatherService
from queue_service import QueueService

def start_scheduler():
    weather = WeatherService()
    queue = QueueService()

    def job():
        data = weather.fetch_weather()
        queue.send(data)

    # coleta a cada 1 hora
    schedule.every(60).minutes.do(job)

    print("⏳ Coletor iniciado. Aguardando primeiro ciclo...")

    while True:
        schedule.run_pending()
        time.sleep(1)
