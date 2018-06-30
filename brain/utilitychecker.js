let utilitychecker = {
    checkifroleexists: (guild, role) => {
        let roles = guild.roles.array();
        let serverrolearray = [];
        for (let x = 0; x < roles.length; x++) {
            serverrolearray.push(roles[x].name.toLowerCase());
        }
        return (serverrolearray.includes(role.toLowerCase())) ? true : false;
    },
    getroleid: (guild, role) => {
        let roles = guild.roles.array().filter(r => {
            return r.name == role;
        });
        return roles[0].id;
    },
    getrolebyid: (roleid, guild) => {
        let role = guild.roles.array().filter(r => {
            return r.id == roleid
        });
        return role;
    },
    isEmpty: obj => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },
    trueRandom: arr => {
        function getRandomItem() {
            let rand = "";
            do {
                rand = arr[Math.floor(Math.random() * arr.length)];
            }
            while (rand == global.LastRandomItem);
            global.LastRandomItem = rand;
            return rand;
        }
        return getRandomItem();
    }
}

module.exports = utilitychecker;