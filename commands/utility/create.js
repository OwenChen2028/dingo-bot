const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dbClient = require('../../dbClient');

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
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
        if (!interaction.guild) {
            return await interaction.reply('This command can only be used in a server.');
        }

        await interaction.deferReply();

        const term = interaction.options.getString('term');
        const definition = interaction.options.getString('definition');
        const createdBy = interaction.user.id;
        const tableName = `dingo_${interaction.guild.id}`;

        try {
            const checkTableQuery = `SELECT to_regclass('${tableName}')`;
            const tableCheck = await dbClient.query(checkTableQuery);

            if (!tableCheck.rows[0].to_regclass) {
                return await interaction.editReply('Please run `/init` first to initialize the table.');
            }

            const addTermQuery = `
                INSERT INTO ${tableName} (term, definition, created_by)
                VALUES ($1, $2, $3);
            `;

            await dbClient.query(addTermQuery, [term, definition, createdBy]);
            await interaction.editReply(`Term **${term}** added successfully.`);
        }
        catch (error) {
            console.error('Error adding term:', error);
            await interaction.editReply('An error occurred while adding the term.');
        }
	},
};