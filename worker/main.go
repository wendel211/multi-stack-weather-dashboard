package main

import (
	"log"
	"time"
)

func main() {
	log.Println("🚀 Iniciando Worker Go...")

	msgChannel := make(chan WeatherMessage)

	go ConsumeQueue(msgChannel)

	for msg := range msgChannel {
		log.Println("🔄 Processando mensagem...")

		// Retry simples de 3 tentativas
		maxRetries := 3
		success := false

		for i := 0; i < maxRetries; i++ {
			err := SendToAPI(msg)
			if err == nil {
				success = true
				break
			}

			log.Println("⏳ Tentativa falhou, retry em 3s...")
			time.Sleep(3 * time.Second)
		}

		if !success {
			log.Println("❌ Falha fatal: não foi possível enviar dados para API após retries.")
		}
	}
}
