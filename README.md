# Requisitos

Antes de executar o projeto, é necessário instalar:

- Node 24.08^
- Yarn: `$ npm install -g yarn`
- MongoDB 7 ou superior (local ou hospedado)

# Instalar as dependências

Execute:

`yarn install`

# Configurar o MongoDB

É necessário possuir um banco de dados MongoDB para a API. Crie um banco com o nome desejado e as collections `participants` e `batches` serão criadas automaticamente se ainda não existirem.

O driver cria automaticamente os índices de unicidade necessários para `tokenHash` e para o par `participantId`/`clientBatchId`.

# Configurar as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto, copiando o exemplo do `.env.example`.

Exemplo:

`NODE_ENV=development`
`PORT=3000`
`DATABASE_URL="mongodb://localhost:27017/mobile_data"`

Para um servidor MongoDB autenticado, use uma URL no formato `mongodb://usuario:SENHA@host:27017/mobile_data?authSource=admin`.

Não há migrations: os documentos são gravados nas collections `participants` e `batches`. Cada documento de `batches` contém suas medições e células vizinhas embutidas.

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
- Health (GET): `http://ADDRESS:PORT/api/v1/health`

Os endpoints protegidos utilizam:

`Authorization: Bearer SEU_TOKEN`