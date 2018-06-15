const path = require('path');
const fs = require('fs');

const fileApi = require('./fileApi');
const fetchApi = require('./fetchApi');
const sqlApi = require('./sqlApi.js');

const fileMain = path.join(__dirname, '../json');
const moduleMain = path.join(__dirname, '../modules');

let serverSetup = {
    exists: serverid => {
        return new Promise((resolve, reject) => {
            sqlApi.get(`SELECT * FROM guilds WHERE serverID = ${serverid}`).then(res => {
                resolve((res.length == 1) ? true : false);
            });
        });
    },
    create: serverid => {
        sqlApi.query(`INSERT INTO guilds (prefix, serverID) VALUES ('?!', ${serverid})`);
    }
}

module.exports = serverSetup;