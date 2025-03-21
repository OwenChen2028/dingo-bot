const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dbClient = require('../../dbClient');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('readall')
        .setDescription('Displays all rows in the current server\'s table.')
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

            const readAllQuery = `SELECT * FROM ${tableName}`;
            const result = await dbClient.query(readAllQuery);

            if (result.rows.length === 0) {
                return await interaction.editReply('No rows found in the table.');
            }

            let response = '';
            
            for (const row of result.rows) {
                const createdDate = new Date(row.created_at).toLocaleString();
                const modifiedDate = row.modified_at ? new Date(row.modified_at).toLocaleString() : 'Never';

                const termInfo = 
                    `**Term:** ${row.term}\n**Definition:** ${row.definition}\n` +
                    `**Created By:** ${row.created_by}\n**Created At:** ${createdDate}\n` +
                    `**Modified By:** ${row.modified_by || 'N/A'}\n**Modified At:** ${modifiedDate}\n` +
                    `**Change Count:** ${row.change_count}\n\n`;

                if ((response + termInfo).length > 1900) {
                    response += '... (continued)';
                    break;
                }

                response += termInfo;
            }

            await interaction.editReply(response);
        }
        catch (error) {
            console.error('Error displaying all rows:', error);
            await interaction.editReply('An error occurred while displaying all rows.');
        }
    },
};