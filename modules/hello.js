const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        let greetings = ['hello', 'hi', 'aloha', 'g\'day', 'heyo'];

        if (message.mentions.users.size != 0) {
            let mentionedUser = message.mentions.users.first();
            let mentionedGuildUser = message.guild.members.get(mentionedUser.id);
            let mentionedPersonName = mentionedGuildUser.nickname || mentionedGuildUser.displayName;

            let guildAuthor = message.guild.members.get(message.author.id)
            let authorName = guildAuthor.nickname || guildAuthor.displayName;

            if (mentionedGuildUser.id == 455827368586772507 || mentionedGuildUser.id == 459451947506728961) {
                message.channel.send(`${util.trueRandom(greetings)} ${authorName}`);
            } else {
                message.channel.send(`${authorName} says **${util.trueRandom(greetings)}** to ${mentionedPersonName}`);
            }
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