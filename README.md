# Mercurius Backend - NestJS

Este repositório contém o backend do projeto Mercurius, desenvolvido utilizando o framework NestJS. O Mercurius é um sistema CMS (Content Management System) rápido e simples, projetado para facilitar a criação e a gestão de conteúdo digital. Este guia irá orientá-lo através das etapas necessárias para realizar o deploy em um ambiente de produção.

## Requisitos

- Node.js v20 ou superior
- npm v10 ou superior

Verifique se o PM2 está instalado:

```shell
pm2 -v
```

Se o PM2 não estiver instalado, instale com:

```shell
npm install -g pm2
```

## Deploy em produção

### Clonagem ou atualização do projeto

```shell
# Clonar o repositório
git clone https://github.com/mineot/mercurius-nestjs.git

# Acessar a pasta recém-criada do projeto
cd mercurius-nestjs
```

### Ou, caso o projeto já exista, atualize

```shell
# Acessar a pasta do projeto
cd mercurius-nestjs

# Atualizar o repositório
git pull --rebase
git fetch --tags
```

### Acessar a Tag para Deploy

```shell
# Liste as tags disponíveis
git tag -l

# Acesse a tag que será utilizada em produção
git checkout tags/<tag_code>
```

### Instalação das Dependências

```shell
npm install
```

### Criação de Chave Secreta (Opcional)

```shell
npx ts-node scripts/create_secret_key --message "<Informe uma message>"
```

### Configuração de Variáveis de Ambiente

Crie ou edite o arquivo .env na raiz do projeto e adicione o conteúdo abaixo:

```shell
JWT_SECRET="<Sua chave secreta criada randomicamente ou por outros meios>"
```

### Criação de Token de Acesso Público

Crie um token de acesso público que será utilizado pelo frontend para acessar o conteúdo público do projeto.

```shell
npx ts-node scripts/create_public_token --issuer "<Informe o nome do projeto>"
```

### Migração e Seeders

Rode a migração do Prisma em produção e execute os seeders:

```shell
npx prisma migrate deploy
npm run db:seeders
```

### Compilação e Execução

Compile o projeto:

```shell
npm run build
```

Em seguida, execute-o utilizando o PM2:

```shell
pm2 start dist/main.js --name "Nome do projeto"

pm2 status
```
