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
    }
}

module.exports = utilitychecker;