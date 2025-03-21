const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Client } = require('pg');
const dbClient = require('../../dbClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Initializes a new table for the current server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
        if (!interaction.guild) {
            return await interaction.reply('This command can only be used in a server.');
        }

        await interaction.deferReply();

        const createTableQuery = `
            CREATE TABLE dingo_${interaction.guild.id} (
                term VARCHAR(255) PRIMARY KEY,
                definition TEXT NOT NULL,
                created_by VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_by VARCHAR(255),
                modified_at TIMESTAMP,
                change_count INT DEFAULT 0
            );
        `;
		
        try {
            await dbClient.query(createTableQuery);
            await interaction.editReply(`Table created successfully for server: ${interaction.guild.name}`);
        }
        catch (error) {
            if (error.code === '42P07') { // 42P07 is the SQL error code for "table already exists"
                await interaction.editReply('A table for this server already exists.');
            }
            else {
                console.error('Error creating table:', error);
                await interaction.editReply('An error occurred while creating the table.');
            }
        }
	},
};