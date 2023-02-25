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
                        .setDescription("Returns all commands, or exact command details for a specific command.")
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
            let options = interaction.options
            let specificCommand = options.getString("command")
            if (specificCommand) {
                let commandData = await getCommandInfo(specificCommand)

                let embed = await buildCommandInfoEmbed(commandData)

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            } else {
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
                ActionRow.setComponents([LeftArrow, Number, RightArrow])

                let ActionRow2 = new ActionRowBuilder()
                let SelectMenu = new SelectMenuBuilder()
                    .setPlaceholder("Get command details")
                    .setCustomId('ssm/cmd')

                let builtOptions = []

                pages[0].forEach(element => {
                    builtOptions.push(
                        {
                            "label": `${element.name}`,
                            "value": `${element.name}`
                        }
                    )
                });

                SelectMenu.setOptions(builtOptions)

                ActionRow2.setComponents([SelectMenu])

                interaction.reply({
                    content: `Command ran into no errors`,
                    embeds: [new EmbedBuilder().setTitle("Commands").setFields(pages[0])],
                    components: [ActionRow, ActionRow2],
                    ephemeral: true
                })
            }
        },
        /**
         * 
         * @param {AutocompleteInteraction} interaction 
         * @param {Client} client 
         */
        async autocomplete(interaction, client) {
            let currentText = interaction.options.getFocused()

            let response = await getCommandInfos([])
            let interactionResponse = []
            let names = Object.values(response).map(option => option.name).filter(option => option.startsWith(currentText))
            let i = 0
            for (const name of names) {
                if (i < 25) {
                    let thisReponse = {
                        "name": name,
                        "nameLocalizations": Locale.EnglishUS,
                        "value": `${name}`
                    }
                    interactionResponse.push(thisReponse)
                    i++
                }
            }
            interaction.respond(
                interactionResponse
            )
        }
    },
    template2: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template2')
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
        },
    },
    template3: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template3')
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
        },
    },
    template4: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template4')
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
        },
    },
    template5: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template5')
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
        },
    },
    template6: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template6')
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
        },
    },
    template7: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template7')
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
        },
    },
    template8: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template8')
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
        },
    },
    template9: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template9')
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
        },
    },
    template10: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template10')
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
        },
    },
    template11: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template11')
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
        },
    },
    template12: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template12')
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
        },
    },
    template13: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template13')
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
        },
    },
    template14: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template14')
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
        },
    },
    template15: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template15')
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
        },
    },
    template16: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template16')
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
        },
    },
    template17: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template18')
                .setDescription('This is a template18. *duh*')
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
        },
    },
    template18: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template19')
                .setDescription('This is a template19. *duh*')
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
        },
    },
    template20: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template20')
                .setDescription('This is a template20. *duh*')
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
        },
    },
    template21: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template21')
                .setDescription('This is a template21. *duh*')
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
        },
    },
    template22: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template22')
                .setDescription('This is a template22. *duh*')
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
        },
    },
    template23: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template23')
                .setDescription('This is a template23. *duh*')
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
        },
    },
    template24: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template24')
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
        },
    },
    template25: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template25')
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
        },
    },
    template26: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template26')
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
        },
    },
    template27: {
        data: {
            command: new SlashCommandBuilder()
                .setName('template27')
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
        },
    },
}

module.exports = commands