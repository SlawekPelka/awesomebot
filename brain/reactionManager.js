const path = require('path');

const sqlApi = require('./sqlApi');
const util = require('./utilitychecker');

let reactionmanager = {
    refillglobaloptinmessages: async() => {
        sqlApi.get(`SELECT * from rankoptin`).then(res => {
            res.forEach((v, i) => {
                global.optinmessages.push({
                    mid: v.messageID,
                    rid: v.rankID
                });
            });
        });
    },
    addnewmembertooptin: async(msg, user) => {
        let filteredOutRole = global.optinmessages.filter(v => v.mid == msg.message.id);
        let gmember = await msg.message.guild.fetchMember(user);

        gmember.addRole(util.getrolebyid(filteredOutRole[0].rid, msg.message.guild)[0]);
        sqlApi.query(`INSERT INTO rankoptinpeople (roleID, userID, messageID) VALUES (${filteredOutRole[0].rid}, ${gmember.id}, ${filteredOutRole[0].mid})`);
    },
    addnewroletodatabase: async(messageID, guildID, authorID) => {
        let filteredOutRole = global.optinmessages.filter(v => v.mid == messageID);
        let res = await sqlApi.get(`SELECT * FROM rankoptin WHERE rankID = ${filteredOutRole[0].rid}`);

        if (res.length == 0)
            sqlApi.query(`INSERT INTO rankoptin (rankID, serverID, messageID) VALUES (${filteredOutRole[0].rid},  ${guildID}, ${filteredOutRole[0].mid})`);
    },
    removememberfromoptin: async(msg, user) => {
        let res = await sqlApi.get(`SELECT rankID FROM rankoptin WHERE messageID = ${msg.message.id}`);

        let gmember = await msg.message.guild.fetchMember(user);
        gmember.removeRole(util.getrolebyid(res[0].rankID, msg.message.guild)[0]);

        sqlApi.query(`DELETE FROM rankoptinpeople WHERE messageID = ${msg.message.id}`);
    },
    uprespectsofmessage: msg => {
        let currentContent = msg.message.content;
        let currentReactionCount = msg.message.reactions.first().count - 1;

        sqlApi.get(`SELECT * FROM respects WHERE messageID = ${msg.message.id}`).then(res => {
            if (res.length == 0) {
                sqlApi.query(`INSERT INTO respects (messageID, respectCount) VALUES (${msg.message.id}, ${currentReactionCount})`);
            } else {
                sqlApi.query(`UPDATE respects SET respectCount = ${currentReactionCount} WHERE messageID = ${msg.message.id}`);
            }
            msg.message.edit(currentContent.replace(/\d+/g, currentReactionCount));
        });
    },
    downrespectsofmessage: msg => {
        let currentContent = msg.message.content;
        let currentReactionCount = msg.message.reactions.first().count - 1;

        sqlApi.query(`UPDATE respects SET respectCount = ${currentReactionCount} WHERE messageID = ${msg.message.id}`);
        msg.message.edit(currentContent.replace(/\d+/g, currentReactionCount));
    }
}

module.exports = reactionmanager;
