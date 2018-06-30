const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        let greetings = ['hello', 'hi', 'aloha', 'g\'day', 'tomat shall return'];

        if (message.mentions.users.size != 0) {
            let mentionedUser = message.mentions.users.first();
            let guildUser = message.guild.members.get(mentionedUser.id);
            let mentionedPersonName = guildUser.nickname || guildUser.displayName;
            let authorName = message.author.username;
            message.channel.send(`${authorName} says **${util.trueRandom(greetings)}** to ${mentionedPersonName}`);
        } else {
            message.channel.send(util.trueRandom(greetings));
            return;
        }

    },
    meta: () => {
        return {
            "name": "Hello",
            "desc": "Says 'hello'",
            "aliases": ["greet"],
            "adminonly": false
        }
    }
}

module.exports = cmd;