# 🌦️ Multi-Stack Weather Dashboard  
### Desafio GDASH — Sistema completo com API, Dashboard, Coletor e Queue

Este projeto é um **ecossistema completo de monitoramento climático** desenvolvido para o desafio GDASH, integrando:
- Backend **NestJS**  
- Dashboard **React + Vite + Tailwind**  
- Coletor de dados **Python**  
- Worker de consumo com **Go**  
- Mensageria **RabbitMQ**  
- Banco **MongoDB**  
- Integração via **Docker Compose**

---

## 🚀 Arquitetura Geral
```
frontend (React) → API NestJS → MongoDB
                        ↑
            Worker Go (consome da fila)
                        ↑
         RabbitMQ Queue "weather_queue"
                        ↑
          Python Collector (produz dados)
```

---

## 📦 Tecnologias Utilizadas

- **Frontend:** React + Vite + TailwindCSS  
- **Backend:** NestJS, Swagger, JWT  
- **Storage:** MongoDB  
- **Mensageria:** RabbitMQ  
- **Collector:** Python 3.11  
- **Worker:** Go 1.21  
- **Infraestrutura:** Docker & Docker Compose  
- **Charts:** Recharts  
- **UI:** Componentes customizados + Tailwind

---

## 🐳 Como executar tudo com Docker

### 1. Iniciar o projeto
```sh
docker compose up -d --build
```

Aguarde até que todos os containers estejam saudáveis:
```sh
docker ps
```

### 2. Acessos

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost |
| API NestJS | http://localhost:3000 |
| Swagger | http://localhost:3000/api |
| RabbitMQ UI | http://localhost:15672 |
| MongoDB | localhost:27017 |

---

## 🔐 Credenciais iniciais

Após a subida da API, um usuário admin é criado automaticamente:
```
Email: admin@gdash.com  
Senha: 123456
```

Login diretamente na interface web.

---

## 📁 Estrutura do Projeto
```bash
multi-stack-weather-dashboard/
 ├── api/               # NestJS backend
 ├── frontend/          # React + Vite + Tailwind
 ├── collector/         # Python weather collector
 ├── worker/            # Go queue consumer
 ├── docker-compose.yml
 └── README.md
```

---

## 📌 Funcionalidades Entregues

### ✔️ Dashboard Climático completo
- Cards métricos
- Gráfico de temperatura ao longo do tempo
- Exportação CSV/XLSX
- Insights de IA
- Filtros avançados:
  - Intervalo de datas
  - Condição climática
  - Temperatura min/max

### ✔️ CRUD completo de usuários
- Criar, editar e excluir
- Modal responsivo
- UI moderna
- Badges de roles
- Feedback visual e toasts

### ✔️ Exploração de API externa (Pokémon API)
- Listagem com paginação
- Modal de detalhes
- UI animada

### ✔️ Tema Dark/Light implementado em toda a aplicação

### ✔️ Pipeline Weather Data
1. Python coleta dados → envia para RabbitMQ
2. Worker Go consome → envia para API
3. API persiste no MongoDB
4. Dashboard atualiza

---

## 🎯 Status do Desafio

| Item | Status |
|------|--------|
| API funcional | ✔️ |
| Dashboard completo | ✔️ |
| Coletor | ✔️ |
| Worker | ✔️ |
| Docker + Compose | ✔️ |
| Autenticação JWT | ✔️ |
| CRUD Usuários | ✔️ |
| Filtros Avançados | ✔️ |
| Tema Dark/Light | ✔️ |
| Bônus: Explore API | ✔️ |