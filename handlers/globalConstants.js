const { REST, Routes, Events, Client, InteractionType, EmbedBuilder, Embed, Options, ApplicationCommandOptionType, SlashCommandBuilder } = require('discord.js');
/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    // CLASSES

    class argumentInfo {
        constructor() {
        }

        name = ""
        description = ""
        type = ""

        /**
         * 
         * @param {string} newName 
         * @returns {commandInfo}
         */
        setName(newName) {
            if (typeof (newName) !== "string") throw new TypeError(`<argument>.setName() argument #1 expected "string", recieved "${typeof (newName)}"`)
            this.name = newName

            return this
        }

        /**
         * 
         * @param {string} newDescription 
         * @returns {commandInfo}
         */
        setDescription(newDescription) {
            if (typeof (newDescription) !== "string") throw new TypeError(`<argument>.setDescription() argument #1 expected "string", recieved "${typeof (newDescription)}"`)
            this.description = newDescription

            return this
        }

        /**
         * 
         * @param {string} newType 
         * @returns {commandInfo}
         */
        setType(newType) {
            if (typeof (newType) !== "string") throw new TypeError(`<argument>.setType() argument #1 expected "string", recieved "${typeof (newType)}"`)
            this.type = newType

            return this
        }

        /**
         * 
         * @returns {{}}
         */
        toJSON() {
            let jsonData = {
                name: this.name,
                description: this.description,
                type: this.type
            }

            return jsonData
        }
    }

    class commandInfo {
        constructor() {


        }

        name = ""
        description = ""
        arguments = []

        /**
         * 
         * @param {string} newName 
         * @returns {commandInfo}
         */
        setName(newName) {
            if (typeof (newName) !== "string") throw new TypeError(`<commandInfo>.setName() argument #1 expected "string", recieved "${typeof (newName)}"`)
            this.name = newName

            return this
        }

        /**
         * 
         * @param {string} newDescription 
         * @returns {commandInfo}
         */
        setDescription(newDescription) {
            if (typeof (newDescription) !== "string") throw new TypeError(`<commandInfo>.setDescription() argument #1 expected "string", recieved "${typeof (newDescription)}"`)
            this.description = newDescription

            return this
        }

        /**
         * 
         * @param {[<argument>]} newArguments 
         * @returns {commandInfo}
         */
        setArguments(newArguments) {
            if (typeof (newArguments) !== "object") throw new TypeError(`<commandInfo>.addArguments() argument #1 expected "object", recieved "${typeof (newArguments)}"`)

            this.arguments = []
            newArguments.forEach((arg, index) => {
                if (typeof (arg) !== "object") throw new TypeError(`<commandInfo>.addArguments() argument #1 expected an "object" containing "argument"s, recieved "${typeof (arg)}"`)

                this.arguments.push(arg)
            })


            return this
        }

        /**
         * 
         * @param {[argumentInfo]} newArguments 
         * @returns {commandInfo}
         */
        addArguments(newArguments) {
            if (typeof (newArguments) !== "object") throw new TypeError(`<commandInfo>.addArguments() argument #1 expected "object", recieved "${typeof (newArguments)}"`)

            newArguments.forEach((arg, index) => {
                if (typeof (arg) !== "object") throw new TypeError(`<commandInfo>.addArguments() argument #1 expected an "object" containing "argument"s, recieved "${typeof (arg)}"`)

                this.arguments.push(arg)
            })


            return this
        }

        /**
         * 
         * @returns {{}}
         */
        toJSON() {
            let jsonData = {
                name: this.name,
                description: this.description,
                arguments: []
            }

            this.arguments.forEach((argument, index) => {
                jsonData.arguments.push(argument.toJSON())
            })

            return jsonData
        }
    }

    global.commandInfo = commandInfo

    global.argumentInfo = argumentInfo



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
    
    /**
     * 
     * @param {String} commandName 
     */

    const getCommandInfo = async function (commandName) {
        if (typeof (commandName) !== "string") throw new TypeError(`global.getCommandInfo() argument #1 expected "string", recieved "${typeof (commandName)}"`)

        let commands = require('../interactions/slash.js')

        if (commands[commandName]) {
            const command = commands[commandName]

            let commandData = new commandInfo()
                .setName(command.data.command.name)
                .setDescription(command.data.command.description)

            command.data.command.options.forEach((value, index) => {
                const data = value.toJSON()

                let argumentData = new argumentInfo()
                    .setName(data.name || "No argument name???")
                    .setDescription(data.description || "No description")

                if (data.type === ApplicationCommandOptionType.String) {
                    if (data.autocomplete === false) {
                        argumentData.setType("String")
                    } else {
                        argumentData.setType("String/AutoComplete")
                    }
                } else if (data.type === ApplicationCommandOptionType.Attachment) {
                    argumentData.setType("Attachment")
                } else if (data.type === ApplicationCommandOptionType.Boolean) {
                    argumentData.setType("Boolean")
                } else if (data.type === ApplicationCommandOptionType.Channel) {
                    argumentData.setType("Channel")
                } else if (data.type === ApplicationCommandOptionType.Integer) {
                    argumentData.setType("Integer")
                } else if (data.type === ApplicationCommandOptionType.Mentionable) {
                    argumentData.setType("Mentionable")
                } else if (data.type === ApplicationCommandOptionType.Number) {
                    argumentData.setType("Number")
                } else if (data.type === ApplicationCommandOptionType.Role) {
                    argumentData.setType("Role")
                } else if (data.type === ApplicationCommandOptionType.Subcommand) {
                    argumentData.setType("SubCommand")
                } else if (data.type === ApplicationCommandOptionType.SubcommandGroup) {
                    argumentData.setType("SubCommandGroup")
                } else if (data.type === ApplicationCommandOptionType.User) {
                    argumentData.setType("User")
                }

                commandData.addArguments([argumentData])
            })

            return {
                code: 200,
                message: "Successfully returned commandData",
                data: commandData.toJSON()
            }
        } else {
            return {
                code: 404,
                message: `No command exists with the name "${commandName}"`
            }
        }
    }

    global.getCommandInfo = getCommandInfo

    /**
     * 
     * @param {[String]} commands Filters command list to set commands
     * @param {((builder: commandInfo) => commandInfo)} filterData Filter the returned data.
     * 
     * @returns {[any]}
     */

    const getCommandInfos = async function (commandNames, filterData) {
        if (typeof (commandNames) !== "object") throw new TypeError(`global.getCommandInfos() argument #1 expected to be an "object", but recieved "${typeof (commandNames)}"`)
        let commands = require('../interactions/slash.js')
        let response = {
            template: new commandInfo().toJSON()
        }
        for (const [index, command] of Object.entries(commands)) {
            let commandData = new commandInfo()
                .setName(command.data.command.name)
                .setDescription(command.data.command.description)

            command.data.command.options.forEach((value, index) => {
                const data = value.toJSON()

                let argumentData = new argumentInfo()
                    .setName(data.name || "No argument name???")
                    .setDescription(data.description || "No description")

                if (data.type === ApplicationCommandOptionType.String) {
                    if (data.autocomplete === false) {
                        argumentData.setType("String")
                    } else {
                        argumentData.setType("String/AutoComplete")
                    }
                } else if (data.type === ApplicationCommandOptionType.Attachment) {
                    argumentData.setType("Attachment")
                } else if (data.type === ApplicationCommandOptionType.Boolean) {
                    argumentData.setType("Boolean")
                } else if (data.type === ApplicationCommandOptionType.Channel) {
                    argumentData.setType("Channel")
                } else if (data.type === ApplicationCommandOptionType.Integer) {
                    argumentData.setType("Integer")
                } else if (data.type === ApplicationCommandOptionType.Mentionable) {
                    argumentData.setType("Mentionable")
                } else if (data.type === ApplicationCommandOptionType.Number) {
                    argumentData.setType("Number")
                } else if (data.type === ApplicationCommandOptionType.Role) {
                    argumentData.setType("Role")
                } else if (data.type === ApplicationCommandOptionType.Subcommand) {
                    argumentData.setType("SubCommand")
                } else if (data.type === ApplicationCommandOptionType.SubcommandGroup) {
                    argumentData.setType("SubCommandGroup")
                } else if (data.type === ApplicationCommandOptionType.User) {
                    argumentData.setType("User")
                }

                commandData.addArguments([argumentData])
            })

            response[command.data.command.name] = commandData.toJSON()
        }
        return response
    }

    global.getCommandInfos = getCommandInfos

    /**
     * 
     * @param {({commandInfo...})} infos 
     */

    const pageCommandInfos = async function (infos) {

        let pages = []

        Object.entries(infos).forEach((value, index) => {
            let page = Math.floor(index / 25)
            if (pages[page]) {
                pages[page].push({
                    value: value[1].description,
                    name: value[1].name
                })
            } else {
                pages[page] = []
                pages[page].push({
                    value: value[1].description,
                    name: value[1].name
                })
            }
        })

        return pages
    }
    
    global.pageCommandInfos = pageCommandInfos

    /**
     * 
     * @param {commandInfo.toJSON} info 
     */

    const buildCommandInfoEmbed = async function (info) {
        let embed = new EmbedBuilder()
            .setTitle(`Commands/${info.data.name}`)
            .setDescription(`${info.data.description}`)


        /**
         * 
         * @param {argumentInfo} info 
         */
        const addArgumentField = async function (info){
            embed.addFields({
                "name": `${info.name} (${info.type})`,
                "value": `${info.description}`
            })
        } 

        info.data.arguments.forEach(addArgumentField)

        return embed
    }

    global.buildCommandInfoEmbed = buildCommandInfoEmbed
}