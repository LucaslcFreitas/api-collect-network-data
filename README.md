# Requisitos

Antes de executar o projeto, é necessário instalar:

- Node 24.08^
- Yarn: `$ npm install -g yarn`
- PostgreSQL 18 (pode ser via Docker)

# Instalar as dependências

Execute:

`yarn install`

# Configurar o PostgreSQL

É necessário possuir um banco de dados PostgreSQL para a API.

`CREATE DATABASE mobile_data;`

O nome utilizado não precisa ser exatamente esse, mas deverá corresponder à configuração utilizada na variável `DATABASE_URL`.

# Configurar as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto, copiando o exemplo do `.env.example`.

Exemplo:

`NODE_ENV=development`
`PORT=3000`
`DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/mobile_data"`

Para DATABASE_URL, substitua:

- `postgres` pelo usuário do PostgreSQL;
- `PASSWORD` pela senha do usuário;
- `localhost` pelo endereço do servidor PostgreSQL, caso esteja em outro computador;
- `5432` pela porta utilizada pelo PostgreSQL;
- `mobile_data` pelo nome do banco.

# Configurar o Prisma

Depois de instalar as dependências e configurar o .env, gere o Prisma Client:

`npx prisma generate`

# Executar as migrations

O projeto utiliza migrations do Prisma para criar e atualizar a estrutura do banco de dados.

Para um ambiente de desenvolvimento recém-configurado, execute:

`npx prisma migrate dev`

# Executar a API em desenvolvimento

Para iniciar a API em modo de desenvolvimento:

`npm run dev`

A url base para acesso à API é:

`http://ADDRESS:PORT/api/v1`

Os endpoints disponíveis são:

- Participant
- - Registro (POST): `http://ADDRESS:PORT/api/v1/participant`
- - Get Me (GET, protegido): `http://ADDRESS:PORT/api/v1/participant`
- - Update Me (PATCH, protegido): `http://ADDRESS:PORT/api/v1/participant`
- - Revoke (POST, protegido): `http://ADDRESS:PORT/api/v1/participant/revoke`
- - Delete (DELETE, protegido): `http://ADDRESS:PORT/api/v1/participant`
- Batches
- - Insert (POST, protegido): `http://ADDRESS:PORT/api/v1/batches`
- Data
- - Get Data (GET, protegido): `http://ADDRESS:PORT/api/v1/data`
- - Get All (GET, protegido para admin): `http://ADDRESS:PORT/api/v1/data/getAll`
- Environment
- - Listar opções (GET, público): `http://ADDRESS:PORT/api/v1/environment`
- - Adicionar morphology (POST, protegido): `http://ADDRESS:PORT/api/v1/environment/morphology`
- - Adicionar topography (POST, protegido): `http://ADDRESS:PORT/api/v1/environment/topography`
- Health (GET): `http://ADDRESS:PORT/api/v1/health`

Os endpoints protegidos utilizam:

`Authorization: Bearer SEU_TOKEN`