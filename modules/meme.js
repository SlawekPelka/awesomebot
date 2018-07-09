const request = require('request');
const imgur = require('imgur-search');
const imgurSearch = new imgur("02b7974af47d7e6");

let p = Promise.resolve();

const c = require('canvas');
const Image = require('canvas').Image;
const canvas = c.createCanvas(400, 225);
const ctx = canvas.getContext('2d');

const util = require('../brain/utilitychecker');

let cmd = {
    exec: (message, args) => {
        args = args.splice(1, args.length);
        let memeSearchString = args.join(' ');
        let results = [];

        for (let i = 0; i < 6; i++) {
            p = p.then(imgurSearch.getRandomFromSearch(memeSearchString));
            // results.push(p.link);
            console.log(p);
        }



        // let requestSettings = {
        //     url: 'http://via.placeholder.com/100x100',
        //     method: 'GET',
        //     encoding: null
        // };

        // request.get(requestSettings, (err, res, body) => {
        //     if (err) throw err;

        //     var image = new Image;
        //     image.src = body;
        //     ctx.drawImage(image, 0, 0)
        // });




        // let buffer = canvas.toBuffer();
        // message.channel.send("Chose your meme", {
        //     file: buffer
        // });


    },
    meta: () => {
        return {
            "name": "Meme",
            "desc": "Search for a meme",
            "aliases": ["meme"],
            "adminonly": false
        }
    }
}

module.exports = cmd;