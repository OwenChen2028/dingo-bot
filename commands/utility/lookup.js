const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dbClient = require('../../dbClient');
const { Heap } = require('heap-js');
const levenshtein = require('fast-levenshtein');
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const { OpenAI } = require("openai");
const config = require('../../config.json');

const openai = new OpenAI({
    apiKey: config.openAIKey,
});

async function getSemanticSimilarity(embeddingA, embeddingB) {
    const semanticSimilarity = tf.tidy(() => {
        const dotProduct = tf.sum(tf.mul(embeddingA, embeddingB));
        const normA = tf.norm(embeddingA);
        const normB = tf.norm(embeddingB);
        return dotProduct.div(normA.mul(normB));
    });

    return (await semanticSimilarity.data())[0];
}

async function getLLMResponse(prompt) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('Searches for a term whose definition fits the provided context.')
        .addStringOption(option =>
            option.setName('term')
                .setDescription('The term to find.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('context')
                .setDescription('The context the term was used in.')
                .setRequired(true)),

	async execute(interaction) {
        if (!interaction.guild) {
            return await interaction.reply('This command can only be used in a server.');
        }

        await interaction.deferReply();

        const term = interaction.options.getString('term');
        const context = interaction.options.getString('context');
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

            useModel = await use.load();
            const embeddingA = await useModel.embed(`${term} — ${context}`);
        
            const topKEditDist = new Heap((a, b) => b.editDistance - a.editDistance); 
            const topKSemanticSim = new Heap((a, b) => a.semanticSimilarity - b.semanticSimilarity);

            const kEditDist = 3;
            const kSemanticSim = 5;

            for (const row of result.rows) {
                const editDistance = levenshtein.get(term.toLowerCase(), row.term.toLowerCase());

                topKEditDist.push({ term: row.term, definition: row.definition, editDistance });
                if (topKEditDist.size() > kEditDist) topKEditDist.pop();

                const embeddingB = await useModel.embed(`${row.term} — ${row.definition}`);
                const semanticSimilarity = await getSemanticSimilarity(embeddingA, embeddingB);

                topKSemanticSim.push({ term: row.term, definition: row.definition, semanticSimilarity });
                if (topKSemanticSim.size() > kSemanticSim) topKSemanticSim.pop();

                embeddingB.dispose();
            }

            embeddingA.dispose();

            const prompt =
                `You are given a term and its context:\n` +
                `Term: \"${term}\"\n` +
                `Context: \"${context}\"\n\n` +
                `Additionally, there are two ranked lists of term-definition pairs — one based on edit distance and the other on semantic similarity.\n\n` +
                `Top Matches by Edit Distance:\n` +
                `${[...topKEditDist].reverse().map(entry => `Term: ${entry.term}\nDefinition: ${entry.definition}\nEdit Distance: ${entry.editDistance}`).join('\n\n')}\n\n` +
                `Top Matches by Semantic Similarity:\n` +
                `${[...topKSemanticSim].reverse().map(entry => `Term: ${entry.term}\nDefinition: ${entry.definition}\nSimilarity Score: ${entry.semanticSimilarity}`).join('\n\n')}\n\n` +
                `Your task is to select the most accurate term-definition pair that directly defines the specified term within its context. Ensure the selected definition clearly explains what the given term means, rather than describing a related concept. If no definition accurately defines the term, indicate that no suitable definition was found.\n\n` +
                `The user will not see this prompt. Provide the selected definition clearly without mentioning your exact selection processor. You should not explain why you didn't choose specific terms. If no suitable definition was found, do not try to provide one.\n\n` +
                `You must rely solely on the information provided above. Using external knowledge to define the term is prohibited. However, do not be excessively strict. Variations of a term, such as acronyms and other kinds of abbreviations, are allowed.`;

            // console.log(prompt);
            const response = await getLLMResponse(prompt);

            await interaction.editReply(response);
        }
        catch (error) {
            console.error('Error looking up term:', error);
            await interaction.editReply('An error occurred while looking up the term.');
        }
	},
};