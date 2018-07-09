const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        args = args.splice(1, args.length);
        let thingToRespect = args.join(' ');

        if (thingToRespect == '') {
            message.reply("You can't respect nothing!");
            return;
        }

        let pressfemoji = global.mainserver.emojis.find('name', 'pressf');

        message.channel.send(`Press F to pay respect for: **${thingToRespect}**\nCurrent count: 0`).then(m => {
            m.react(pressfemoji);
        });
    },
    meta: () => {
        return {
            "name": "Respect",
            "desc": "Pay respect to certain thing",
            "aliases": ["f", "F", "respecc", "respect"],
            "adminonly": false
        }
    }
}

module.exports = cmd;