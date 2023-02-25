const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
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
            return { authorized: (interaction.user.id === "364569809146347520" && 1 || 0), exactAuths: [] }
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
    },
    "cmd": {
        "subButtons": {
            "left": {
                "subButtons": {
                },
                /**
                 * 
                 * @param {ButtonInteraction} interaction 
                 * @param {Client} client
                 */
                async authCheck(interaction, client) {
                    return { authorized: 1, exactAuths: [] }
                },
                /**
                 * 
                 * @param {ButtonInteraction} interaction 
                 * @param {Client} client 
                 */
                async onPress(interaction, client) {
                    let page = parseInt(interaction.message.components[0].components[1].label)

                    const returned = await getCommandInfos([])
                    let pages = await pageCommandInfos(returned)
                    let ActionRow = new ActionRowBuilder()
                    let LeftArrow = new ButtonBuilder()
                        .setLabel("⬅️")
                        .setCustomId("btn/cmd/left")
                        .setDisabled((typeof(pages[page-3]) === "undefined"))
                        .setStyle(ButtonStyle.Primary)
                    let Number = new ButtonBuilder()
                        .setLabel(`${page-1}`)
                        .setCustomId("btn/cmd/number")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                    let RightArrow = new ButtonBuilder()
                        .setLabel("➡️")
                        .setCustomId("btn/cmd/right")
                        .setDisabled(false)
                        .setStyle(ButtonStyle.Primary)
                    ActionRow.setComponents([LeftArrow, Number, RightArrow])
                    interaction.update({
                        content: `Command ran into no errors`,
                        embeds: [new EmbedBuilder().setTitle("Commands").setFields(pages[page-2])],
                        components: [ActionRow],
                        ephemeral: true
                    })
                }
            },
            "right": {
                "subButtons": {
                },
                /**
                 * 
                 * @param {ButtonInteraction} interaction 
                 * @param {Client} client
                 */
                async authCheck(interaction, client) {
                    return { authorized: 1, exactAuths: [] }
                },
                /**
                 * 
                 * @param {ButtonInteraction} interaction 
                 * @param {Client} client 
                 */
                async onPress(interaction, client) {
                    let page = parseInt(interaction.message.components[0].components[1].label)
                    let pageIndex = page-1
                    let newPageIndex = pageIndex+1

                    const returned = await getCommandInfos([])
                    let pages = await pageCommandInfos(returned)
                    let ActionRow = new ActionRowBuilder()
                    let LeftArrow = new ButtonBuilder()
                        .setLabel("⬅️")
                        .setCustomId("btn/cmd/left")
                        .setDisabled(false)
                        .setStyle(ButtonStyle.Primary)
                    let Number = new ButtonBuilder()
                        .setLabel(`${page+1}`)
                        .setCustomId("btn/cmd/number")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                    let RightArrow = new ButtonBuilder()
                        .setLabel("➡️")
                        .setCustomId("btn/cmd/right")
                        .setDisabled((pages[page] !== null && pages[page] !== "undefined"))
                        .setStyle(ButtonStyle.Primary)
                    ActionRow.setComponents([LeftArrow, Number, RightArrow])
                    interaction.update({
                        content: `Command ran into no errors`,
                        embeds: [new EmbedBuilder().setTitle("Commands").setFields(pages[page])],
                        components: [ActionRow],
                        ephemeral: true
                    })
                }
            }
        },
        /**
         * 
         * @param {ButtonInteraction} interaction 
         * @param {Client} client
         */
        async authCheck(interaction, client) {
            return { authorized: 1, exactAuths: [] }
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