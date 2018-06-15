const fs = require('fs');
const path = require('path');

let file = {
    read: (dir, file) => {
        try {
            let res = fs.readFileSync(path.join(dir, file), 'utf8');
            return JSON.parse(res);
        } catch (e) {
            console.error(e.stack);
            // TODO: propper message api here
        }
    },
    checkIfExists: (dir, file) => {
        return fs.existsSync(path.join(dir, file));
    },
    create: (dir, fileName, content) => {
        if (file.checkIfExists(dir, fileName)) { console.info(`${fileName} already exists`); return; }
        if (!typeof content == "json" || content == undefined) { console.error("File contents must be valid json"); return; }
        fs.writeFile(path.join(dir, fileName), JSON.stringify(content, null, '\t'), 'utf8', err => {
            if (err) throw err;
            console.log("File sucessfully created");
            // TODO: propper message api here
        });
    },
    update: (dir, fileName, content) => {
        if (!file.checkIfExists(dir, fileName)) { console.info(`${fileName} does not exists`); return; }
        let newcontent = content();
        fs.writeFileSync(path.join(dir, fileName), JSON.stringify(newcontent, null, '\t'));
    }
}

module.exports = file;