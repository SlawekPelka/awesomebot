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
    reactionManager.refillglobaloptinmessages();
});

client.on('message', msg => {
    if (msg.channel.type == 'dm') return;
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

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id) || await user.createDM();
    let message = channel.messages.get(data.message_id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;

    if (event.t === 'MESSAGE_REACTION_REMOVE' && message && message.reactions.get(emojiKey) && message.reactions.get(emojiKey).users.size) return;
    if (event.t === 'MESSAGE_REACTION_ADD' && message) return;

    if (!message) {
        message = await channel.fetchMessage(data.message_id);
    }
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    client.emit(events[event.t], reaction, user);
});

client.on('messageReactionAdd', (msg, user) => {
    if (user.id == 455827368586772507 || user.id == 459451947506728961) return;
    switch (msg._emoji.name) {
        case 'optin':
            reactionManager.addnewmembertooptin(msg, user);
            break;
    }
});

client.on('messageReactionRemove', (msg, user) => {
    if (user.id == 455827368586772507 || user.id == 459451947506728961) return;
    switch (msg._emoji.name) {
        case 'optin':
            reactionManager.removememberfromoptin(msg, user);
            break;
    }
});

client.login(fileApi.tokens("bot"));