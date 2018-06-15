const fs = require('fs');
const path = require('path');

const fileApi = require('./fileApi');

const fileMain = path.join(__dirname, '../json');
const moduleMain = path.join(__dirname, '../modules');

let fetch = {
    tokens: (token, usage = "main") => {
        if (token) {
            var tokens = fileApi.read(fileMain, 'tokens.json');
            if (tokens[usage][token] == undefined) console.error("Token not found");
            return tokens[usage][token];
        } else {
            return fileApi.read(fileMain, 'tokens.json');
        }
    },
    moduleMeta: modulename => {
        const modulemetadata = require(`${moduleMain}/${modulename}`).meta();
        return modulemetadata;
    },
    checkifadminonly: commandname => {
        let realcmdname = fetch.checkforaliases(commandname);
        return fetch.moduleMeta(realcmdname).adminonly;
    },
    checkforaliases: commandname => {
        let files = fs.readdirSync(moduleMain);
        for (let x = 0; x < files.length; x++) {
            let getmeta = fetch.moduleMeta(files[x]);
            let aliases = getmeta.aliases.join(",");
            return (aliases.includes(commandname)) ? files[x] : 'none';
        }
    }
}


module.exports = fetch;