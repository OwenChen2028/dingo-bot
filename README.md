# DingoBot Deployment Guide

Welcome! This guide will walk you through setting up and running DingoBot.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- PostgreSQL database

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure the Bot

Create a `config.json` file in the root directory with the following structure:

```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "dbUser": "YOUR_DATABASE_USER",
  "dbHost": "YOUR_DATABASE_HOST",
  "dbName": "YOUR_DATABASE_NAME",
  "dbPassword": "YOUR_DATABASE_PASSWORD",
  "dbPort": "YOUR_DATABASE_PORT"
}
```

- **token**: Your bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
- **clientId**: Your application's client ID
- **dbUser**: Database username
- **dbHost**: Database host (e.g., `localhost`)
- **dbName**: Name of your database
- **dbPassword**: Password for your database
- **dbPort**: Database port (default PostgreSQL port is `5432`)

## Step 4: Deploy Commands

```bash
node deploy-commands.js
```

This will register your bot's commands with Discord.

## Step 5: Start the Bot

```bash
node index.js
```

You should see a message confirming the bot is running.

## Commands

Here are the available commands you can use with DingoBot:

- `/init` - Initializes a table for the server.
- `/create <term> <definition>` - Adds a term and its definition.
- `/read <term>` - Displays information about a specific term.
- `/readall` - Displays all terms and their definitions.
- `/update <term> <definition>` - Updates the definition of an existing term.
- `/delete <term>` - Deletes a specific term.
- `/deleteall` - Deletes all terms from the server's table.
