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
    // `event.t` is the raw event name
    if (!events.hasOwnProperty(event.t)) return;
    var toemit = (event.t == 'MESSAGE_REACTION_ADD') ? 'messageReactionAdd' :
        (event.t == 'MESSAGE_REACTION_REMOVE') ? 'messageReactionRemove' : null;
    console.log(toemit);


    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id) || await user.createDM();

    // if the message is already in the cache, don't re-emit the event
    // if (channel.messages.has(data.message_id)) return;


    // if you're on the master/v12 branch, use `channel.messages.fetch()`
    const message = await channel.fetchMessage(data.message_id);
    if (message && message.reactions.size && message.reactions.first().users.size) return;

    // custom emojis reactions are keyed in a `name:ID` format, while unicode emojis are keyed by names
    // if you're on the master/v12 branch, custom emojis reactions are keyed by their ID
    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);

    client.emit(toemit, reaction, user);
});

client.on('messageReactionAdd', (msg, user) => {
    if (user.id != 455827368586772507 && msg._emoji.name == 'optin') reactionManager.addnewmembertooptin(msg, user);
});

client.on('messageReactionRemove', (msg, user) => {
    console.log("ding");
    if (user.id != 455827368586772507 && msg._emoji.name == 'optin') reactionManager.removememberfromoptin(msg, user);
});

client.login(fileApi.tokens("bot"));