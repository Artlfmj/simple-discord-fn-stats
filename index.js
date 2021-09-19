const Discord = require('discord.js')
require("dotenv").config()
const axios = require('axios')
const chalk = require('chalk')

const client = new Discord.Client({
    intents : ["GUILDS", "GUILD_MESSAGES", "GUILD_INTEGRATIONS", "GUILD_MEMBERS"]
})

client.on("ready", async() => {
    console.log(chalk.green(`Successfuly connected to ${client.user.tag}`))
    console.warn(chalk.bold("Registering slash commands"))
    const stats = {
        name : "stats",
        description : "Gets stats of a Fortnite Player",
        options : [
            {
                name : "username",
                description : "Username of the account you wish to look at",
                required : true,
                type : "STRING"
            },
            {
                name : "platform",
                description : "Platform the user plays on",
                required : false,
                type : "STRING",
                choices : [
                    {
                        name : "pc",
                        value : "epic"
                    },
                    {
                        name : "Playstation",
                        value : "psn"
                    },
                    {
                        name : "xbox",
                        value : "xbl"
                    }
                ]
            },
            {
                name : "timewindow",
                description : "Timewindow of the stats to show",
                required : false,
                type : "STRING",
                choices : [
                    {
                        name : "lifetime",
                        value : "lifetime"
                    },
                    {
                        name : "season", 
                        value : "season"
                    }
                ]
            }
        ]
    };
    await client.application.commands.create(stats)
    .catch(e => {
        console.log(chalk.redBright("Stats command | Status : ERROR"))
    })
    .then(console.log(chalk.green("Stats command | Status : Registered")))

    console.log(chalk.yellow.bold("IF THIS IS THE FIRST TIME USING THIS BOT YOU MAY NEED TO WAIT UP TO 15 MIN TO SEE THE SLASH COMMADS ON YOUR SERVER. IF YOU WANT TO SPEED THE PROCESS, PLEASE ADD THE BOT AFTER HAVING RUN AT LEAST ONE TIME THE SETUP PROCESS"))
    
})

client.login(process.env.TOKEN)