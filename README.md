🧩 Order Challenge

Sistema completo com .NET 9 + PostgreSQL + Worker + React + TailwindCSS, para gerenciamento e acompanhamento de pedidos.

🚀 Estrutura do Projeto

order-challenge/
├── backend/
│   ├── OrderApi/
│   └── OrderWorker/
└── frontend/

⚙️ Backend (.NET 9 + PostgreSQL)

🔧 Pré-requisitos

.NET SDK 9.0

PostgreSQL
 em execução local

💾 Configuração do Banco

Edite a connection string no Program.cs:

"Host=localhost;Port=5432;Database=orderdb;Username=postgres;Password=root"

⚡ Ao iniciar a aplicação sera criada a database e as tabelas necessarias apenas certifique-se de configurar a connection string para a do seu servidor local.

▶️ Comandos

cd backend/src/OrderApi
dotnet restore
dotnet run

Para rodar o worker:

cd backend/src/OrderWorker
dotnet restore
dotnet run

💻 Frontend (React + Vite + TailwindCSS)

🔧 Pré-requisitos

Node.js 20+

npm

▶️ Instalação e execução

cd frontend
npm install
npm run dev

Acesse:

👉 http://localhost:5173/

✨ Funcionalidades

Listagem de pedidos (tabela responsiva)

Criação de novos pedidos via formulário

Visualização de detalhes de um pedido

Feedback visual nas mudanças de status

🧠 Observações

O backend precisa estar rodando antes do frontend.

O frontend consome a API em http://localhost:5051/orders.

O banco é criado automaticamente ao iniciar a aplicação.