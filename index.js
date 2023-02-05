const { Client, GatewayIntentBits } = require("discord.js")
const fs = require('node:fs')


const token = require('./jsons/sensitive.json').token || process.env.token

const client = new Client({
    intents: []
})


client.on("ready", (readyClient) => {
    console.log("Logged in...")
    let handlers = fs.readdirSync("./handlers").filter(file => file.endsWith(".js"))
    for (const file of handlers) {
        if (file.endsWith(".disabled.js") === false) {
            const handler = require(`./handlers/${file}`)

            handler(client).then(() => {
                console.log(`Handler "${file}" successfully initilized!`)
            }).catch((err) => {
                console.log(`Handler "${file}" failed to initilize!`)
                console.error(err)
            })
        }
    }
})

client.login(token)