# DingoBot

DingoBot © 2025 by Owen Chen is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1)

DingoBot, short for **Discord Lingo Bot**, is a simple tool for managing and sharing definitions in your Discord server. Whether you're part of a gaming guild, a study group, or just a community with inside jokes, DingoBot makes it easy to keep track of your server’s custom terms.

## How to Use DingoBot

Here’s what you can do with DingoBot:

- `/init` - Initializes a table for the current server in the Dingo database.
- `/create <term> <definition>` - Adds a term and its definition to the current server\'s table.
- `/read <term>` - Finds a term in the current server\'s table and displays its information.
- `/readall` - Displays all rows in the current server\'s table.
- `/update <term> <definition>` - Updates the definition of a term in the current server\'s table.
- `/delete <term>` - Deletes a term from the current server\'s table.
- `/deleteall` - Deletes all rows from the current server\'s table.
- `/lookup <term> <context>` - Searches for a term whose definition fits the provided context. 

Note: In the current implementation, `/lookup` is the only command available to non-admin users. It serves as the sole method through which users can access your server's table. Unlike the `/read` command, it doesn't require an exact match for the specified term to exist in the current server's table.

### Examples
- Define gaming terms like "gg" or "strat" for your guild.
- Create a glossary of server memes or inside jokes.

---

# Deployment Guide

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
  "dbPort": "YOUR_DATABASE_PORT",
  "openAIKey": "YOUR_OPENAI_API_KEY"
}
```

- **token**: Your bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
- **clientId**: Your application's client ID
- **dbUser**: Database username
- **dbHost**: Database host (e.g., `localhost`)
- **dbName**: Name of your database
- **dbPassword**: Database password
- **dbPort**: Database port (default is `5432`)
- **openAIKey**: Your OpenAI API key

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
