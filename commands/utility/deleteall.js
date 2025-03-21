const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dbClient = require('../../dbClient');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteall')
        .setDescription('Deletes all rows from the current server\'s table.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (!interaction.guild) {
            return await interaction.reply('This command can only be used in a server.');
        }

        await interaction.deferReply();
        const tableName = `dingo_${interaction.guild.id}`;

        try {
            const checkTableQuery = `SELECT to_regclass('${tableName}')`;
            const tableCheck = await dbClient.query(checkTableQuery);

            if (!tableCheck.rows[0].to_regclass) {
                return await interaction.editReply('Table does not exist. Please run `/init` first to initialize the table.');
            }

            const deleteAllQuery = `DELETE FROM ${tableName}`;
            await dbClient.query(deleteAllQuery);

            await interaction.editReply('All rows have been deleted successfully.');
        }
        catch (error) {
            console.error('Error deleting all rows:', error);
            await interaction.editReply('An error occurred while deleting all rows.');
        }
    },
};
