const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        if (args[1] == undefined) {
            message.reply("You need to specify the role!");
            return;
        }

        if (!util.checkifroleexists(message.guild, args[1])) {
            message.guild.createRole({
                name: args[1]
            });
            sendMessage();
        } else {
            sendMessage();
        }

        function sendMessage() {
            let optinmoji = global.mainserver.emojis.find('name', 'optin');

            const embed = {
                color: 4484275,
                author: {
                    name: `Opt-in for role: ${args[1]}`
                },
                fields: [{
                        name: 'Join',
                        value: `React with ${optinmoji} to join`
                    },
                    {
                        name: 'Leave',
                        value: `React with ${optinmoji} again to leave`
                    }
                ]
            }
            message.channel.send({ embed }).then(msg => {
                global.optinmessages.push([
                    msg.id,
                    util.getroleid(message.guild, args[1])
                ])
                msg.react(optinmoji);
            });
        }

    },
    meta: () => {
        return {
            "name": "Reaction role assigner",
            "desc": "Assigns role when user clicks on reaction",
            "aliases": ["rra", "reactionrole"],
            "adminonly": true
        }
    }
}

module.exports = cmd;