const { SlashCommandBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { MessageEmbed, CommandInteraction, Client, ButtonInteraction, SelectMenuInteraction, ChatInputCommandInteraction, GuildMember, AutocompleteInteraction, Locale, ChannelSelectMenuInteraction } = require('discord.js')
const { ButtonStyle } = require('discord-api-types/v9')



const menus = {
    "temp": {
        "subMenus": {
        },
        /**
         * 
         * @param {ChannelSelectMenuInteraction} interaction 
         * @param {Client} client
         */
        async authCheck(interaction, client) {
            return (interaction.user.id === "364569809146347520")
        },
        /**
         * 
         * @param {ChannelSelectMenuInteraction} interaction 
         * @param {Client} client 
         */
        async onSelect(interaction, client) {
            let selected = interaction.values[0]
            interaction.update({
                content: `You used the channel-menu and selected <#${selected}> :D`,
            })
        }
    }
}

module.exports = menus