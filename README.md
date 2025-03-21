# Get Started with DingoBot 🐾

DingoBot, short for **Discord Lingo Bot**, is a simple tool for managing and sharing definitions in your Discord server. Whether you're part of a gaming guild, a study group, or just a community with inside jokes, DingoBot makes it easy to keep track of your server’s custom terms.

## How to Use DingoBot

Here’s what you can do with DingoBot:

- `/init` - Set up a table for your server.
- `/create <term> <definition>` - Add a new term and its definition.
- `/read <term>` - Look up a specific term.
- `/readall` - See a list of all terms and their definitions.
- `/update <term> <definition>` - Change the definition of an existing term.
- `/delete <term>` - Remove a term from the table.
- `/deleteall` - Delete all terms from the server’s table.

### Examples
- Define gaming terms like "gg" or "strat" for your guild.
- Create a glossary of server memes or inside jokes.

# DingoBot Deployment Guide

Here’s how to get DingoBot up and running using Node.js.

## Prerequisites

Make sure you have:

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

Create a `config.json` file in the root directory with the following:

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
- **dbPassword**: Database password
- **dbPort**: Database port (default is `5432`)

## Step 4: Deploy Commands

```bash
node deploy-commands.js
```

This registers your commands with Discord.

## Step 5: Start the Bot

```bash
node index.js
```

You’ll see a confirmation when the bot is running.

## Troubleshooting

- Make sure your database is running and credentials are correct.
- Double-check that your bot token is valid.
- Review any error messages in the console.
- Confirm that the bot has the necessary permissions in your Discord server.

## Additional Notes

- Use `pm2` or `screen` to keep the bot running in the background.
- Regularly check for updates and keep backups of your database.

Enjoy using DingoBot!
