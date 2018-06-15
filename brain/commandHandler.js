const path = require('path');

const fetchApi = require('./fetchApi');
const sqlApi = require('./sqlApi');

const moduleMain = path.join(__dirname, '../modules');

let cmdhandler = {
    handle: msg => {
        cmdhandler.checkifprefixed(msg.guild.id, msg.content).then(prefres => {
            if (!prefres) return;
            let cmdname = msg.content.replace('?!', '').split(' ')[0];

            if (!cmdhandler.checkifcommandexists(cmdname)) {
                msg.reply("That command doesn't seem to be active or to exist!");
                return;
            } else {
                if (cmdhandler.checkifadminonly(cmdname) && !cmdhandler.checkifuserisadmin(msg.channel, msg.member)) {
                    msg.reply("You're not allowed to use this command!");
                    return;
                } else {
                    cmdhandler.executecommand(cmdname, msg);
                }
            }
        });
    },
    executecommand: (commandname, message) => {
        let realname = fetchApi.checkforaliases(commandname);
        let args = message.content.replace(`?!${commandname}`, '').split(' ');
        const cmd = require(`${moduleMain}/${realname}`).exec(message, args);
    },
    checkifprefixed: (guildid, commandcontent) => {
        return new Promise((resolve, reject) => {
            sqlApi.get(`SELECT prefix from guilds where serverID = ${guildid}`).then(pref => {
                resolve((commandcontent.startsWith(pref[0].prefix)) ? true : false);
            });
        });
    },
    checkifcommandexists: commandname => {
        let possiblecommand = fetchApi.checkforaliases(commandname);
        return (possiblecommand == 'none') ? false : true;
    },
    checkifadminonly: commandname => {
        return (fetchApi.checkifadminonly(commandname)) ? true : false;
    },
    checkifuserisadmin: (channel, user) => {
        let userroles = channel.permissionsFor(user);
        return (userroles.has('MANAGE_GUILD')) ? true : false;
    }
}

module.exports = cmdhandler;