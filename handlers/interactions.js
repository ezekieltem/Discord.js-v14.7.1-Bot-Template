const { REST, Routes, Events, Client, InteractionType, ComponentType, Locale } = require('discord.js');
const fs = require('node:fs');
const token = require('../jsons/sensitive.json').token || process.env.token
/**
 * 
 * @param {Client} client 
 */

module.exports = async (client, authorized) => {

    const commands = [];
    const commandData = require("../interactions/slash.js")
    // Grab all the command files from the commands directory you created earlier

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment

    for (const [key, command] of Object.entries(commandData)) {
        commands.push(command.data.command.toJSON());
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(token);

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(client.application.id),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);

            client.on("interactionCreate", (interaction) => {
                try {
                    if (interaction.type === InteractionType.ApplicationCommand) {
                        if (interaction.user.bot === true) return interaction.reply({
                            embeds: [embeds.interactions.botDenied],
                            ephemeral: true
                        })
                        let command = commandData[interaction.commandName]

                        command.data.authCheck(interaction, client).then(({authorized,exactAuths}) => {
                            console.log(authorized)
                            if (authorized >= 1) {
                                command.command(interaction, client, authorized, exactAuths).catch((err) => {
                                    console.error(err)
                                    interaction.reply({
                                        embeds: [embeds.interactions.interFail],
                                        ephemeral: true
                                    }).catch((err) => {
                                        console.err(err)
                                        interaction.editReply({
                                            embeds: [embeds.interactions.interFail],
                                            ephemeral: true
                                        }).catch(console.error)
                                    })
                                })
                            } else {
                                interaction.reply({
                                    embeds: [embeds.interactions.notAuthed],
                                    ephemeral: true
                                })
                            }
                        }).catch((err) => {
                            console.error(err)
                            interaction.reply({
                                embeds: [embeds.interactions.authFail],
                                ephemeral: true
                            })
                        })
                    } else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
                        if (interaction.user.bot === true) return interaction.reply({
                            embeds: [embeds.interactions.botDenied],
                            ephemeral: true
                        })
                        let command = commandData[interaction.commandName]

                        command.data.authCheck(interaction, client).then(({authorized,exactAuths}) => {
                            if (authorized >= 1) {
                                command.autocomplete(interaction, client, authorized, exactAuths).catch((err) => {
                                    console.error(err)
                                    interaction.respond(
                                        [
                                            {
                                                value: "errored",
                                                name: "The autocomplete encountered an error!",
                                                nameLocalizations: Locale.EnglishUS
                                            }
                                        ]
                                    ).catch((err) => {
                                        console.error(err)
                                        interaction.respond(
                                            [
                                                {
                                                    value: "errored",
                                                    name: "The autocomplete encountered an error!",
                                                    nameLocalizations: Locale.EnglishUS
                                                }
                                            ]
                                        ).catch(console.error)
                                    })
                                })
                            } else {
                                interaction.respond(
                                    [
                                        {
                                            value: "noAuth",
                                            name: "Not authorized",
                                            nameLocalizations: Locale.EnglishUS
                                        }
                                    ]
                                ).catch((err) => {
                                    console.error(err)
                                    interaction.respond(
                                        [
                                            {
                                                value: "errored",
                                                name: "The autocomplete encountered an error!",
                                                nameLocalizations: Locale.EnglishUS
                                            }
                                        ]
                                    ).catch(console.error)
                                })
                            }
                        }).catch((err) => {
                            console.error(err)
                            interaction.respond(
                                [
                                    {
                                        value: "errored",
                                        name: "The autocomplete encountered an error!",
                                        nameLocalizations: Locale.EnglishUS
                                    }
                                ]
                            ).catch(console.error)
                        })
                    } else if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ComponentType.Button) {
                        if (interaction.user.bot === true) return interaction.reply({
                            embeds: [embeds.interactions.botDenied],
                            ephemeral: true
                        })
                        let buttonData = require("../interactions/button.js")
                        console.log(buttonData)

                        let interactionIdSplit = interaction.customId.split("/")
                        console.log(interactionIdSplit)

                        let button = buttonData[interactionIdSplit[1]]

                        console.log(button)

                        button.authCheck(interaction, client).then(({authorized,exactAuths}) => {
                            if (authorized >= 1) {
                                interactionIdSplit.forEach((value, index) => {
                                    console.log(value, index)
                                    if (index > 1) {
                                        button = button.subButtons[value]
                                    }
                                })
                                button.onPress(interaction, client, authorized, exactAuths).catch((err) => {
                                    console.error(err)
                                    interaction.reply({
                                        embeds: [embeds.interactions.interFail],
                                        ephemeral: true
                                    }).catch((err) => {
                                        console.err(err)
                                        interaction.editReply({
                                            embeds: [embeds.interactions.interFail],
                                            ephemeral: true
                                        }).catch(console.error)
                                    })
                                })
                            } else {
                                interaction.reply({
                                    embeds: [embeds.interactions.notAuthed],
                                    ephemeral: true
                                })
                            }
                        }).catch((err) => {
                            console.error(err)
                            interaction.reply({
                                embeds: [embeds.interactions.authFail],
                                ephemeral: true
                            })
                        })
                    } else if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ComponentType.StringSelect) {
                        if (interaction.user.bot === true) return interaction.reply({
                            embeds: [embeds.interactions.botDenied],
                            ephemeral: true
                        })
                        let menuData = require("../interactions/string-menu.js")
                        console.log(menuData)

                        let interactionIdSplit = interaction.customId.split("/")
                        console.log(interactionIdSplit)

                        let menu = menuData[interactionIdSplit[1]]

                        console.log(menu)

                        menu.authCheck(interaction, client).then(({authorized,exactAuths}) => {
                            if (authorized >= 1) {
                                interactionIdSplit.forEach((value, index) => {
                                    console.log(value, index)
                                    if (index > 1) {
                                        menu = menu.subMenus[value]
                                    }
                                })
                                menu.onSelect(interaction, client, authorized, exactAuths).catch((err) => {
                                    console.error(err)
                                    interaction.reply({
                                        embeds: [embeds.interactions.interFail],
                                        ephemeral: true
                                    }).catch((err) => {
                                        console.err(err)
                                        interaction.editReply({
                                            embeds: [embeds.interactions.interFail],
                                            ephemeral: true
                                        }).catch(console.error)
                                    })
                                })
                            } else {
                                interaction.reply({
                                    embeds: [embeds.interactions.notAuthed],
                                    ephemeral: true
                                })
                            }
                        }).catch((err) => {
                            console.error(err)
                            interaction.reply({
                                embeds: [embeds.interactions.authFail],
                                ephemeral: true
                            })
                        })
                    } else if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ComponentType.RoleSelect) {
                        if (interaction.user.bot === true) return interaction.reply({
                            embeds: [embeds.interactions.botDenied],
                            ephemeral: true
                        })
                        let menuData = require("../interactions/role-menu.js")
                        console.log(menuData)

                        let interactionIdSplit = interaction.customId.split("/")
                        console.log(interactionIdSplit)

                        let menu = menuData[interactionIdSplit[1]]

                        console.log(menu)

                        menu.authCheck(interaction, client).then(({authorized,exactAuths}) => {
                            if (authorized >= 1) {
                                interactionIdSplit.forEach((value, index) => {
                                    console.log(value, index)
                                    if (index > 1) {
                                        menu = menu.subMenus[value]
                                    }
                                })
                                menu.onSelect(interaction, client, authorized, exactAuths).catch((err) => {
                                    console.error(err)
                                    interaction.reply({
                                        embeds: [embeds.interactions.interFail],
                                        ephemeral: true
                                    }).catch((err) => {
                                        console.err(err)
                                        interaction.editReply({
                                            embeds: [embeds.interactions.interFail],
                                            ephemeral: true
                                        }).catch(console.error)
                                    })
                                })
                            } else {
                                interaction.reply({
                                    embeds: [embeds.interactions.notAuthed],
                                    ephemeral: true
                                })
                            }
                        }).catch((err) => {
                            console.error(err)
                            interaction.reply({
                                embeds: [embeds.interactions.authFail],
                                ephemeral: true
                            })
                        })
                    } else if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ComponentType.ChannelSelect) {
                        if (interaction.user.bot === true) return interaction.reply({
                            embeds: [embeds.interactions.botDenied],
                            ephemeral: true
                        })
                        let menuData = require("../interactions/channel-menu.js")
                        console.log(menuData)

                        let interactionIdSplit = interaction.customId.split("/")
                        console.log(interactionIdSplit)

                        let menu = menuData[interactionIdSplit[1]]

                        console.log(menu)

                        menu.authCheck(interaction, client).then(({authorized,exactAuths}) => {
                            if (authorized >= 1) {
                                interactionIdSplit.forEach((value, index) => {
                                    console.log(value, index)
                                    if (index > 1) {
                                        menu = menu.subMenus[value]
                                    }
                                })
                                menu.onSelect(interaction, client, authorized, exactAuths).catch((err) => {
                                    console.error(err)
                                    interaction.reply({
                                        embeds: [embeds.interactions.interFail],
                                        ephemeral: true
                                    }).catch((err) => {
                                        console.err(err)
                                        interaction.editReply({
                                            embeds: [embeds.interactions.interFail],
                                            ephemeral: true
                                        }).catch(console.error)
                                    })
                                })
                            } else {
                                interaction.reply({
                                    embeds: [embeds.interactions.notAuthed],
                                    ephemeral: true
                                })
                            }
                        }).catch((err) => {
                            console.error(err)
                            interaction.reply({
                                embeds: [embeds.interactions.authFail],
                                ephemeral: true
                            })
                        })
                    } else if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ComponentType.UserSelect) {
                        if (interaction.user.bot === true) return interaction.reply({
                            embeds: [embeds.interactions.botDenied],
                            ephemeral: true
                        })
                        let menuData = require("../interactions/user-menu.js")
                        console.log(menuData)

                        let interactionIdSplit = interaction.customId.split("/")
                        console.log(interactionIdSplit)

                        let menu = menuData[interactionIdSplit[1]]

                        console.log(menu)

                        menu.authCheck(interaction, client).then(({authorized,exactAuths}) => {
                            if (authorized >= 1) {
                                interactionIdSplit.forEach((value, index) => {
                                    console.log(value, index)
                                    if (index > 1) {
                                        menu = menu.subMenus[value]
                                    }
                                })
                                menu.onSelect(interaction, client, authorized, exactAuths).catch((err) => {
                                    console.error(err)
                                    interaction.reply({
                                        embeds: [embeds.interactions.interFail],
                                        ephemeral: true
                                    }).catch((err) => {
                                        console.err(err)
                                        interaction.editReply({
                                            embeds: [embeds.interactions.interFail],
                                            ephemeral: true
                                        }).catch(console.error)
                                    })
                                })
                            } else {
                                interaction.reply({
                                    embeds: [embeds.interactions.notAuthed],
                                    ephemeral: true
                                })
                            }
                        }).catch((err) => {
                            console.error(err)
                            interaction.reply({
                                embeds: [embeds.interactions.authFail],
                                ephemeral: true
                            })
                        })
                    } else {
                        console.log(`Unhandled interaction type!\nInteraction Type: ${interaction.type}\nCommand Type: ${interaction.commandType}\nComponent Type: ${interaction.componentType}`)
                    }
                } catch (err) {
                    console.error(err)
                    interaction.reply({
                        embeds: [embeds.interactions.handlerFail],
                        ephemeral: true
                    }).catch((err) => {
                        console.err(err)
                        interaction.editReply({
                            embeds: [embeds.interactions.handlerFail],
                            ephemeral: true
                        }).catch(console.error)
                    })
                }
            })
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.log("Warning! Failed to load commands! Exiting process!")
            console.error(error);
            process.exit()
        }
    })();
}