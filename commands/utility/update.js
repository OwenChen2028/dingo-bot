const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dbClient = require('../../dbClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('Updates the definition of a term in the current server\'s table.')
		.addStringOption(option =>
			option.setName('term')
				.setDescription('The term to update.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('definition')
				.setDescription('The new definition of the term.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		if (!interaction.guild) {
			return await interaction.reply('This command can only be used in a server.');
		}

		await interaction.deferReply();

		const term = interaction.options.getString('term');
		const definition = interaction.options.getString('definition');
		const modifiedBy = interaction.user.id;
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
				return await interaction.editReply(`No definition found for **${term}**. Use /create to add it.`);
			}

			const updateTermQuery = `
				UPDATE ${tableName}
				SET definition = $1, modified_by = $2, modified_at = CURRENT_TIMESTAMP, change_count = change_count + 1
				WHERE term = $3;
			`;

			await dbClient.query(updateTermQuery, [definition, modifiedBy, term]);
			await interaction.editReply(`Definition for **${term}** updated successfully.`);
		}
        catch (error) {
			console.error('Error updating term:', error);
			await interaction.editReply('An error occurred while updating the term.');
		}
	},
};
