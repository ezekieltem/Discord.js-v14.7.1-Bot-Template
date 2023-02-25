const { SlashCommandBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { MessageEmbed, CommandInteraction, Client, MentionableSelectMenuBuilder, MentionableSelectMenuInteraction, RoleSelectMenuBuilder, RoleSelectMenuInteraction, UserSelectMenuBuilder, UserSelectMenuInteraction, ButtonInteraction, SelectMenuInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction, ChatInputCommandInteraction, GuildMember, AutocompleteInteraction, Locale, PermissionFlagsBits, EmbedBuilder, Emoji, parseEmoji } = require('discord.js')
const { ButtonStyle } = require('discord-api-types/v9')


const commands = {
    template: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template')
                .setDescription('This is a template. *duh*')
                .addStringOption(option =>
                    option.setName("string")
                        .setAutocomplete(true)
                        .setRequired(false)
                        .setDescription("This is an option description")
                )
            ,
            handler: {
                load: false,
            },
            /**
             * 
             * @param {ChatInputCommandInteraction} interaction 
             * @param {Client} client
             */
            async authCheck(interaction, client) {
                return { authorized: (interaction.user.id === "364569809146347520" && 1 || 0), exactAuths: [] }
            },
        },
        /**
         * 
         * @param {ChatInputCommandInteraction} interaction 
         * @param {Client} client
         */
        async command(interaction, client, authLevel) {
            const ButtonRow = new ActionRowBuilder()
            const Button = new ButtonBuilder()
                .setLabel('Button')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`btn/temp`)
            ButtonRow.setComponents([Button])
            const StringMenuRow = new ActionRowBuilder()
            const StringMenu = new StringSelectMenuBuilder()
                .setOptions([
                    {
                        label: 'Option 1',
                        value: 'Opt1'
                    },
                    {
                        label: 'Option 2',
                        value: 'Opt2'
                    }
                ])
                .setMinValues(0)
                .setMaxValues(1)
                .setCustomId(`ssm/temp`)
                .setPlaceholder('String')
            StringMenuRow.setComponents([StringMenu])
            const RoleMenuRow = new ActionRowBuilder()
            const RoleMenu = new RoleSelectMenuBuilder()
                .setMinValues(0)
                .setMaxValues(1)
                .setCustomId("rsm/temp")
                .setPlaceholder("Role")
            RoleMenuRow.setComponents([RoleMenu])
            const ChannelMenuRow = new ActionRowBuilder()
            const ChannelMenu = new ChannelSelectMenuBuilder()
                .setMinValues(0)
                .setMaxValues(1)
                .setCustomId("csm/temp")
                .setPlaceholder("Channel")
            ChannelMenuRow.setComponents([ChannelMenu])
            const UserMenuRow = new ActionRowBuilder()
            const UserMenu = new UserSelectMenuBuilder()
                .setMinValues(0)
                .setMaxValues(1)
                .setCustomId("usm/temp")
                .setPlaceholder("User")
            UserMenuRow.setComponents([UserMenu])
            interaction.reply({
                content: 'This is a template',
                ephemeral: true,
                components: [ButtonRow, StringMenuRow, RoleMenuRow, ChannelMenuRow, UserMenuRow],
            })
        },
        /**
         * 
         * @param {AutocompleteInteraction} interaction 
         * @param {Client} client 
         */
        async autocomplete(interaction, client, authLevel) {
            interaction.respond(
                [
                    {
                        "name": "This is an autocomplete",
                        "nameLocalizations": Locale.EnglishUS,
                        "value": "temp-Auto"
                    }
                ]
            )
        }
    },
    commands: {
        data: {
            command: new SlashCommandBuilder()
                .setName('commands')
                .setDescription('Returns all commands and what they do.')
                .setDMPermission(false)
                .addStringOption(option =>
                    option.setName('command')
                        .setDescription("Returns a specific command, or all commands that start with any set of character (*) ex: *t")
                        .setAutocomplete(true)
                        .setRequired(false)
                )
            ,
            handler: {
                load: false,
            },
            /**
             * 
             * @param {ChatInputCommandInteraction} interaction 
             * @param {Client} client
             */
            async authCheck(interaction, client) {
                return { authorized: 1, exactAuths: [] }
            },
        },
        /**
         * 
         * @param {ChatInputCommandInteraction} interaction 
         * @param {Client} client
         * @param {number} authLevel
         * @param {[]} exactAuths 
         */
        async command(interaction, client, authLevel, exactAuths) {
            const returned = await getCommandInfos([])
            let pages = await pageCommandInfos(returned)
            let ActionRow = new ActionRowBuilder()
            let LeftArrow = new ButtonBuilder()
                .setLabel("⬅️")
                .setCustomId("btn/cmd/left")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
            let Number = new ButtonBuilder()
                .setLabel("1")
                .setCustomId("btn/cmd/number")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)
            let RightArrow = new ButtonBuilder()
                .setLabel("➡️")
                .setCustomId("btn/cmd/right") 
                .setDisabled((pages.length <= 1))
                .setStyle(ButtonStyle.Primary)
            ActionRow.setComponents([LeftArrow,Number,RightArrow])
            interaction.reply({
                content: `Command ran into no errors`,
                embeds: [new EmbedBuilder().setTitle("Commands").setFields(pages[0])],
                components: [ActionRow],
                ephemeral: true
            })
        },
        /**
         * 
         * @param {AutocompleteInteraction} interaction 
         * @param {Client} client 
         */
        async autocomplete(interaction, client) {
            let currentText = interaction.options.getFocused()
            if (currentText.startsWith("*")) {
                let response = await getCommandInfos([])
                let characters = ("abcdefghijklmnopqrstuvwxyz").split("")
                let interactionResponse = []
                characters.forEach((value, index) => {
                    console.log(currentText + value)
                    interactionResponse.push({
                        name: currentText + value,
                        nameLocalizations: Locale.EnglishUS,
                        value: currentText + value
                    })
                })
                if (interactionResponse.length > 25) {
                    for (const i of interactionResponse) {
                        if (interactionResponse.length === 25) {
                        } else {
                            interactionResponse.pop()
                        }
                    }
                }
                interaction.respond(
                    interactionResponse
                )
            } else {
                let response = await getCommandInfos([])
                let interactionResponse = []
                let names = Object.values(response).map(option => option.name).filter(option => option.startsWith(currentText))
                for (const name of names) {
                    let thisReponse = {
                        "name": name,
                        "nameLocalizations": Locale.EnglishUS,
                        "value": `${name}`
                    }
                    interactionResponse.push(thisReponse)
                }
                interaction.respond(
                    interactionResponse
                )
            }
        }
    }
}

module.exports = commands