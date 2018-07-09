const util = require('../brain/utilitychecker');
const reactionManager = require('../brain/reactionManager');

let cmd = {
    exec: (message, args) => {
        args = args.splice(1, args.length);
        let rolename = args.join(' ');
        let whitespaceTest = new RegExp(/\s+/g);

        if (whitespaceTest.test(rolename) || rolename == '') {
            message.reply("You need to specify the role!");
            return;
        }

        let getExistingRole = util.checkifroleexists(message.guild, rolename);

        if (!getExistingRole) {
            message.guild.createRole({
                name: rolename
            });
            sendMessage();
        } else {
            sendMessage();
        }


        function sendMessage() {
            let optinmoji = global.mainserver.emojis.find('name', 'optin');

            const embed = {
                color: getExistingRole[0].color,
                author: {
                    name: `Opt-in for role: ${rolename}`
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
                global.optinmessages.push({
                    mid: msg.id,
                    rid: util.getroleid(message.guild, rolename)
                });
                reactionManager.addnewroletodatabase(msg.id, msg.guild.id, msg.author.id);
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