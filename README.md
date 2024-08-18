# Mercurius Backend - NestJS

This repository contains the backend of the Mercurius project, developed using the NestJS framework. Mercurius is a fast and simple Content Management System (CMS) designed to facilitate the creation and management of digital content. This guide will walk you through the steps required to deploy in a production environment.

## Requirements

- Node.js v20 or higher
- npm v10 or higher

### Verify PM2 Installation

Check if PM2 is installed:

```shell
pm2 -v
```

If PM2 is not installed, you can install it with:

```shell
npm install -g pm2
```

## Production Deployment

### Cloning or Updating the Project

If you need to clone the repository:

```shell
git clone https://github.com/mineot/mercurius-nestjs.git
cd mercurius-nestjs
```

If the project is already cloned, update it:

```shell
cd mercurius-nestjs
git pull --rebase
git fetch --tags
```

### Accessing the Deployment Tag

List the available tags:

```shell
git tag -l
```

Check out the tag to be used in production:

```shell
git checkout tags/<tag_code>
```

### Installing Dependencies

Install the project dependencies:

```shell
npm install
```

### Creating a Secret Key (Optional)

Create a secret key for use with JWT, if needed:

```shell
npx ts-node scripts/create_secret_key --message "<Provide a message>"
```

### Environment Variables Configuration

Create or edit the `.env` file in the project root and add the following content:

```shell
JWT_SECRET="<Your randomly generated or otherwise obtained secret key>"
```

### Creating a Public Access Token

Generate a public access token that will be used by the frontend to access the project's public content:

```shell
npx ts-node scripts/create_public_token --issuer "<Provide the project name>"
```

### Migration and Seeders

Run the Prisma migration in production and execute the seeders:

```shell
npx prisma migrate deploy
npm run db:seeders
```

### Compilation and Execution

Compile the project:

```shell
npm run build
```

Run the project using PM2:

```shell
pm2 start dist/main.js --name "Project Name"
```

Check the application status:

```shell
pm2 status
```
