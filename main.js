const Discord = require('discord.js');
const client = new Discord.Client();
const path = require('path');
const mysql = require('mysql');

const sqlApi = require(path.join(__dirname, 'brain/sqlApi'));
const fileApi = require(path.join(__dirname, 'brain/fetchApi'));
const fetchApi = require(path.join(__dirname, 'brain/fetchApi'));
const serverSetup = require(path.join(__dirname, 'brain/serverSetup'));
const commandHandler = require(path.join(__dirname, 'brain/commandHandler'));
const reactionManager = require(path.join(__dirname, 'brain/reactionManager'))


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    global.mainserver = client.guilds.get('274959744526188545');
    global.optinmessages = [];

    let conntokens = fetchApi.tokens("mysql", "thirdparty");
    global.con = mysql.createConnection({
        host: conntokens.host,
        user: conntokens.username,
        password: conntokens.password,
        database: conntokens.dbname,
        insecureAuth: true
    });
    sqlApi.init();

});

client.on('message', msg => {
    commandHandler.handle(msg);
});

client.on('guildCreate', guild => {
    serverSetup.exists(guild.id).then(r => {
        if (r)
            return;
        else
            serverSetup.create(guild.id);
    })
});

client.on('messageReactionAdd', (msg, user) => {
    if (user.id != 455827368586772507 && msg._emoji.name == 'optin') reactionManager.addnewmembertooptin(msg, user);
});

client.on('messageReactionRemove', (msg, user) => {
    if (user.id != 455827368586772507 && msg._emoji.name == 'optin') reactionManager.removememberfromoptin(msg, user);
});

client.login(fileApi.tokens("bot"));