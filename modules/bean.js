const ifunny = require('ifunny-web-api');

const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        if (message.mentions.users.size == 0) {
            message.reply("You didn't mention anyone!");
            return;
        }

        let ownerId = message.guild.owner.id;
        let mentionedUser = message.mentions.users.first();
        let guildUser = message.guild.members.get(mentionedUser.id);

        if (mentionedUser.id == ownerId) message.reply("I can't do this to an owner!");

        guildUser.setNickname(mentionedUser.username + " [beaned]");
        ifunny({ shuffle: false }, (err, res) => {
            guildUser.createDM().then(dm => {
                dm.send(res[Math.floor(Math.random() * res.length)].src)
            });
        });
    },
    meta: () => {
        return {
            "name": "Bean",
            "desc": "Bean someone",
            "aliases": ["bean"],
            "adminonly": true
        }
    }
}

module.exports = cmd;