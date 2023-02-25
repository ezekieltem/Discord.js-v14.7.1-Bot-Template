const { SlashCommandBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { MessageEmbed, CommandInteraction, Client, ButtonInteraction, SelectMenuInteraction, ChatInputCommandInteraction, GuildMember, AutocompleteInteraction, Locale, StringSelectMenuInteraction } = require('discord.js')
const { ButtonStyle } = require('discord-api-types/v9')



const menus = {
    "temp": {
        "subMenus": {
        },
        /**
         * 
         * @param {StringSelectMenuInteraction} interaction 
         * @param {Client} client
         */
        async authCheck(interaction, client) {
            return { authorized: 1, exactAuths: [] }
        },
        /**
         * 
         * @param {StringSelectMenuInteraction} interaction 
         * @param {Client} client 
         */
        async onSelect(interaction, client) {
            let selected = interaction.values[0]
            interaction.update({
                content: `You used the string-menu and selected "${selected}" :D`,
            })
        }
    },
    "cmd": {
        "subMenus": {
        },
        /**
         * 
         * @param {StringSelectMenuInteraction} interaction 
         * @param {Client} client
         */
        async authCheck(interaction, client) {
            return { authorized: 1, exactAuths: [] }
        },
        /**
         * 
         * @param {StringSelectMenuInteraction} interaction 
         * @param {Client} client 
         */
        async onSelect(interaction, client) {
            let selected = interaction.values[0]
            let commandData = await getCommandInfo(selected)
            let embed = await buildCommandInfoEmbed(commandData)

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }
    }
}

module.exports = menus