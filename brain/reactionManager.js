const path = require('path');

const sqlApi = require('./sqlApi');
const util = require('./utilitychecker');

let reactionmanager = {
    addnewmembertooptin: (msg, user) => {
        let filtered;
        for (let x = 0; x < global.optinmessages.length; x++) {
            if (global.optinmessages[x][0] == msg.message.id) filtered = global.optinmessages[x];
        }
        sqlApi.get(`SELECT * FROM rankoptin WHERE rankID = ${filtered[1]}`).then(res => {
            if (res.length == 0) {
                sqlApi.query(`INSERT INTO rankoptin (rankID, serverID) VALUES (${filtered[1]}, ${msg.message.guild.id})`);
            }
            sqlApi.query(`INSERT INTO rankoptinpeople (roleID, userID, messageID) VALUES (${filtered[1]}, ${user.id}, ${msg.message.id})`);
            let gmember = msg.message.guild.fetchMember(user).then(memb => {
                memb.addRole(util.getrolebyid(filtered[1], msg.message.guild)[0]);
            });
        });
    },
    removememberfromoptin: (msg, user) => {
        sqlApi.get(`SELECT roleID FROM rankoptinpeople WHERE messageID = ${msg.message.id}`).then(result => {
            let gmember = msg.message.guild.fetchMember(user).then(memb => {
                memb.removeRole(util.getrolebyid(result[0].roleID, msg.message.guild)[0]);
            });
            sqlApi.query(`DELETE FROM rankoptinpeople WHERE messageID = ${msg.message.id}`);
        });
    }
}

module.exports = reactionmanager;