package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type WeatherData struct {
	Temperature float64 `json:"temperature"`
	Humidity    float64 `json:"humidity"`
	WindSpeed   float64 `json:"wind_speed"`
	Condition   string  `json:"condition"`
	Timestamp   string  `json:"timestamp"`
}

func main() {
	// Carregar configs diretamente do ambiente (Docker Compose)
	rabbitURL := os.Getenv("RABBITMQ_URL")
	apiURL := os.Getenv("API_URL")
	queueName := os.Getenv("QUEUE_NAME")

	if rabbitURL == "" || apiURL == "" || queueName == "" {
		log.Fatal("❌ Variáveis RABBITMQ_URL, API_URL e QUEUE_NAME devem estar definidas.")
	}

	log.Println("🚀 Worker Go iniciado...")
	log.Printf("📡 Conectando ao RabbitMQ: %s", rabbitURL)

	// Conectar ao RabbitMQ
	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		log.Fatalf("❌ Erro ao conectar ao RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("❌ Erro ao abrir canal: %v", err)
	}
	defer ch.Close()

	// Garantir que a fila existe
	_, err = ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("❌ Erro ao declarar fila: %v", err)
	}

	msgs, err := ch.Consume(
		queueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatalf("❌ Erro ao consumir fila: %v", err)
	}

	log.Println("📥 Aguardando mensagens...")

	forever := make(chan bool)

	go func() {
		for msg := range msgs {
			log.Println("📨 Mensagem recebida do RabbitMQ")

			var data WeatherData
			if err := json.Unmarshal(msg.Body, &data); err != nil {
				log.Println("❌ Erro ao decodificar JSON:", err)
				msg.Nack(false, false)
				continue
			}

			log.Printf("🌡 Temp: %.2f°C | 💧 Umidade: %.2f%% | 🌬 Vento: %.2f km/h",
				data.Temperature, data.Humidity, data.WindSpeed)

			success := false

			// Tentativa com exponencial rebote
			for attempt := 1; attempt <= 5; attempt++ {
				err := sendToAPI(apiURL, data)
				if err == nil {
					success = true
					msg.Ack(false)
					log.Println("✅ Dados enviados para API!")
					break
				}

				log.Printf("⚠ Tentativa %d falhou: %v — retry em %d s",
					attempt, err, attempt)
				time.Sleep(time.Duration(attempt) * time.Second)
			}

			if !success {
				log.Println("❌ Falha definitiva. Mensagem descartada.")
				msg.Nack(false, false)
			}
		}
	}()

	<-forever
}

func sendToAPI(apiURL string, data WeatherData) error {
	body, _ := json.Marshal(data)
	url := fmt.Sprintf("%s/weather/logs", apiURL)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)

	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("status HTTP %d", resp.StatusCode)
	}

	return nil
}
