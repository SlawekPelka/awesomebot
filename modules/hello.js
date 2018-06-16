const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        let greetings = ['hello', 'hi', 'aloha', 'g\'day', 'tomat shall return'];
        message.channel.send(greetings[Math.floor(Math.random() * greetings.length)]);
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