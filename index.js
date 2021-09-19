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
    // Registering stats command
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
client.on('interactionCreate', async(interaction) => {
    if(interaction.commandName === "stats"){
        await interaction.reply({content : "Loading stats"})
        // Stats command
        const username = interaction.options.getString("username")
        let platform;
        if(interaction.options.getString("platform")){
            platform = interaction.options.getString("platform")
        } else { platform = "epic"}
        let timeWindow;
        if(interaction.options.getString("timewindow")){
            timeWindow = interaction.options.getString("timewindow")
        } else { timeWindow = "lifetime"}
        const req = await axios({
            url : "https://fortnite-api.com/v2/stats/br/v2",
            method : "get",
            headers : {
                "x-api-key" : process.env.KEY
            },
            params : {
                name : username,
                accountType : platform,
                timeWindow : timeWindow,
                image : "all"
            }
        })
        .catch(e => {
            const em = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(e.toJSON().name)
            .setDescription("An error occured, multiple reasons are possible: \n404 : The account you provided does not exist\n403 : The account you provided hasn't set his stats to public\n400 : Please retry later")
            .setFooter(e.toJSON().message)
            return interaction.editReply({embeds : [em]})
        })
        if(req){
           
            const skins = await axios({
                method : "get",
                url : "https://fortnite-api.com/v2/cosmetics/br/search/all",
                params : {
                    "type" : "outfit"
                }
            })
           
            const embed = new Discord.MessageEmbed()
            .setAuthor(username, skins.data.data[getRandomInt(skins.data.data.length - 1)].images.icon)
            .setTitle("Additional data")
            .addField('Account ID', req.data.data.account.id)
            .addField("Acccount Name", req.data.data.account.name, true)
            .addField("Battlepass Level", req.data.data.battlePass.level.toString())
            .setImage(`${req.data.data.image}`)
            .setColor("RANDOM")
            interaction.editReply({embeds : [embed], content : "\u200b"})
            .catch(e => {
                console.log(e)
            })
        }

    }
})

client.login(process.env.TOKEN)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }