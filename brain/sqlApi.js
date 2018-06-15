let sqlapi = {
    init: () => {
        global.con.connect(err => {
            if (err) throw err;
            console.log("Connected to the database!");
        });
    },
    query: string => {
        global.con.query(string, (err, result) => {
            if (err) throw err;
            console.log("done");
            return;
        });
    },
    get: string => {
        return new Promise((resolve, reject) => {
            global.con.query(string, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        })
    }
}

module.exports = sqlapi;