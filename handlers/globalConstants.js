const { REST, Routes, Events, Client, InteractionType, EmbedBuilder, Embed } = require('discord.js');
module.exports = async (client) => {
    // VARIABLES
    global.embeds = {
        interactions: {
            botDenied: new EmbedBuilder()
                .setColor([255, 0, 0])
                .setDescription(":no_entry: Sorry but bots aren't allowed to run any of my interactions. :no_entry:"),
            notAuthed: new EmbedBuilder()
                .setColor([255, 0, 0])
                .setDescription(":no_entry: You do not meet the requirements to use this interaction. :no_entry:"),
            authFail: new EmbedBuilder()
                .setColor([255, 255, 0])
                .setDescription(":warning: This interactions authCheck encountered an error while running! :warning:"),
            interFail: new EmbedBuilder()
                .setColor([255, 255, 0])
                .setDescription(":warning: This interaction encountered an error while running! :warning:"),
            handlerFail: new EmbedBuilder()
                .setColor([255, 255, 0])
                .setDescription(":warning: The interaction handler encountered an error! :warning:"),
        }
    }

    // FUNCTIONS
}