# Getting Started with DingoBot 🐾

DingoBot, short for **Discord Lingo Bot**, is a simple tool for managing and sharing definitions in your Discord server. Whether you're part of a gaming guild, a study group, or just a community with inside jokes, DingoBot makes it easy to keep track of your server’s custom terms.

## How to Use DingoBot

Here’s what you can do with DingoBot:

- `/init` - Initializes a new table for the current server.
- `/create <term> <definition>` - Adds a term and its definition to the current server\'s table.
- `/read <term>` - Finds a term in the current server\'s table and displays its information.
- `/readall` - Displays all rows in the current server\'s table.
- `/update <term> <definition>` - Updates the definition of a term in the current server\'s table.
- `/delete <term>` - Deletes a term from the current server\'s table.
- `/deleteall` - Deletes all rows from the current server\'s table.
- `/lookup <term> <message>` - Searches for the specified term within the current server’s table and provides an explanation of it in the context of the given message. Unlike the read command, the specified term does not have to match the term in the database exactly. In the current implementation, this is the only command available to non-admin users.

### Examples
- Define gaming terms like "gg" or "strat" for your guild.
- Create a glossary of server memes or inside jokes.

---

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
