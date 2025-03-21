const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dbClient = require('../../dbClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Deletes a term from the current server\'s table.')
		.addStringOption(option =>
			option.setName('term')
				.setDescription('The term to delete.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		if (!interaction.guild) {
			return await interaction.reply('This command can only be used in a server.');
		}

		await interaction.deferReply();

		const term = interaction.options.getString('term');
		const tableName = `dingo_${interaction.guild.id}`;

		try {
			const checkTableQuery = `SELECT to_regclass('${tableName}')`;
			const tableCheck = await dbClient.query(checkTableQuery);

			if (!tableCheck.rows[0].to_regclass) {
				return await interaction.editReply('Table does not exist. Please run `/init` first to initialize the table.');
			}

			const findTermQuery = `
                SELECT *
                FROM ${tableName}
                WHERE term = $1;
            `;

			const result = await dbClient.query(findTermQuery, [term]);

			if (result.rows.length === 0) {
				return await interaction.editReply(`Term **${term}** not found.`);
			}

			const deleteTermQuery = `
				DELETE FROM ${tableName}
				WHERE term = $1;
			`;

			await dbClient.query(deleteTermQuery, [term]);
			await interaction.editReply(`Term **${term}** deleted successfully.`);
		}
		catch (error) {
			console.error('Error deleting term:', error);
			await interaction.editReply('An error occurred while deleting the term.');
		}
	},
};
