const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dbClient = require('../../dbClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('read')
		.setDescription('Displays the definition of a term from the current server\'s table.')
        .addStringOption(option =>
            option.setName('term')
                .setDescription('The term to find.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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
                return await interaction.editReply('Please run `/init` first to initialize the table.');
            }

            const addTermQuery = `
                SELECT *
                FROM ${tableName}
                WHERE term = $1;
            `;

            const result = await dbClient.query(addTermQuery, [term]);

            if (result.rows.length === 0) {
                return await interaction.editReply(`No definition found for **${term}**.`);
            }

            const { definition, created_by, created_at, modified_by, modified_at, change_count } = result.rows[0];
            const createdDate = new Date(created_at).toLocaleString();
            const modifiedDate = modified_at ? new Date(modified_at).toLocaleString() : 'Never';

            const response = `**Term:** ${term}\n**Definition:** ${definition}\n` +
                `**Created By:** ${created_by}\n**Created At:** ${createdDate}\n` +
                `**Modified By:** ${modified_by || 'N/A'}\n` +
                `**Modified At:** ${modifiedDate}\n` +
                `**Change Count:** ${change_count}`;

            await interaction.editReply(response);
        }
        catch (error) {
            console.error('Error retrieving term:', error);
            await interaction.editReply('An error occurred while retrieving the term.');
        }
	},
};