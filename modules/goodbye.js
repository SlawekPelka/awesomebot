const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        let farewells = ['goodbye', 'be gone', 'cya', 'farewell', 'bye noob', 'see ya later'];

        if (message.mentions.users.size != 0) {
            let mentionedUser = message.mentions.users.first();
            let mentionedGuildUser = message.guild.members.get(mentionedUser.id);
            let mentionedPersonName = mentionedGuildUser.nickname || mentionedGuildUser.displayName;

            let guildAuthor = message.guild.members.get(message.author.id)
            let authorName = guildAuthor.nickname || guildAuthor.displayName;

            if (mentionedGuildUser.id == 455827368586772507 || mentionedGuildUser.id == 459451947506728961) {
                message.channel.send(`${util.trueRandom(farewells)} ${authorName}`);
            } else {
                message.channel.send(`${authorName} says **${util.trueRandom(farewells)}** to ${mentionedPersonName}`);
            }
        } else {
            message.channel.send(util.trueRandom(farewells));
            return;
        }

    },
    meta: () => {
        return {
            "name": "Goodbye",
            "desc": "Says 'goodbye'",
            "aliases": ["goodbye"],
            "adminonly": false
        }
    }
}

module.exports = cmd;