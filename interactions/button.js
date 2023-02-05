const { SlashCommandBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { MessageEmbed, CommandInteraction, Client, ButtonInteraction, SelectMenuInteraction, ChatInputCommandInteraction, GuildMember, AutocompleteInteraction, Locale } = require('discord.js')
const { ButtonStyle } = require('discord-api-types/v9')



const buttons = {
    "temp": {
        "subButtons": {
        },
        /**
         * 
         * @param {ButtonInteraction} interaction 
         * @param {Client} client
         */
        async authCheck(interaction, client) {
            return (interaction.user.id === "364569809146347520")
        },
        /**
         * 
         * @param {ButtonInteraction} interaction 
         * @param {Client} client 
         */
        async onPress(interaction, client) {
            interaction.update({
                content: "You pressed the button :D",
            })
        }
    }
}

module.exports = buttons