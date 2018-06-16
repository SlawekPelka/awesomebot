const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        message.channel.send('Hello!');
    },
    meta: () => {
        return {
            "name": "Hello",
            "desc": "Says 'hello'",
            "aliases": ["greet"],
            "adminonly": false
        }
    }
}

module.exports = cmd;