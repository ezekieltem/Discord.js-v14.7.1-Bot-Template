const { SlashCommandBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { MessageEmbed, CommandInteraction, Client, RoleSelectMenuBuilder, RoleSelectMenuInteraction, UserSelectMenuBuilder, UserSelectMenuInteraction, ButtonInteraction, SelectMenuInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction, ChatInputCommandInteraction, GuildMember, AutocompleteInteraction, Locale, PermissionFlagsBits } = require('discord.js')
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

                return {authorized:(interaction.user.id === "364569809146347520" && 1 || 0),exactAuths:[]}
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
                .setDescription('Shout manager')
                .setDMPermission(false)
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
                return {authorized:1,exactAuths:[]}
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
            console.log(exactAuths)
            interaction.reply({
                content: ``,
                ephemeral: true
            })
        },
        /**
         * 
         * @param {AutocompleteInteraction} interaction 
         * @param {Client} client 
         */
        async autocomplete(interaction, client) {
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
    }
}

module.exports = commands