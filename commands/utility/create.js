const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Client } = require('pg');
const config = require('../../config.json');

const dbClient = new Client({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
});

dbClient.connect().then(() => console.log('Connected to database')).catch(err => console.error('Database connection error:', err));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Adds a term and its definition to the current server\'s table.')
        .addStringOption(option =>
            option.setName('term')
                .setDescription('The term to add.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('definition')
                .setDescription('The definition of the term.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),


	async execute(interaction) {
        if (!interaction.guild) {
            return await interaction.reply('This command can only be used in a server.');
        }

        await interaction.deferReply();

        const term = interaction.options.getString('term');
        const definition = interaction.options.getString('definition');
        const createdBy = interaction.user.id;

        const addTermQuery = `
            INSERT INTO dingo_${interaction.guild.id} (term, definition, created_by)
            VALUES ($1, $2, $3);
        `;

        try {
            await dbClient.query(addTermQuery, [term, definition, createdBy]);
            await interaction.editReply(`Term added successfully with its definition.`);
        }
        catch (error) {
            console.error('Error adding term:', error);
            await interaction.editReply('An error occurred while adding the term.');
        }
	},
};