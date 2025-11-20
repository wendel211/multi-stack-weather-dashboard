import pika
import json
import os

class QueueService:
    def __init__(self):
        host = os.getenv("RABBITMQ_HOST", "rabbitmq")
        queue = os.getenv("RABBITMQ_QUEUE", "weather_logs")

        self.queue = queue

        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=host)
        )
        self.channel = connection.channel()
        self.channel.queue_declare(queue=queue, durable=True)

    def send(self, message: dict):
        """Envia dados normalizados para a fila."""

        self.channel.basic_publish(
            exchange="",
            routing_key=self.queue,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2  # mensagem persistente
            )
        )

        print("✔️ Mensagem enviada para a fila:", message)
