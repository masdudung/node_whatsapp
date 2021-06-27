class dbConnection {

    constructor(mysql) {
      this.mysql = mysql;
      this.start()
    }

    async start() {
        console.log('start mysql connection..')
        this.con = this.mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "node_whatsapp",
            port: 3306
        });

        await this.con.connect(function(err) {
            if(err) throw err;
            console.log("Database Connected!");
        });
    }

    select(tableName) {
        var con = this.con
        let sql = `SELECT * FROM ${tableName}`
        
        return new Promise( (resolve, reject) => {
            con.query(sql, function (err, result, fields) {
                if(result === undefined){
                    reject(new Error("Error rows is undefined"));
                }else{
                    resolve(result);
                }
            })
        })
    }

    insert(tableName, token) {
        var con = this.con
        let sql = `INSERT INTO ${tableName} VALUES (NULL, ?, NOW())`;
        
        return new Promise( (resolve, reject) => {
            resolve( con.query(sql, token) )
        })
    }
}



module.exports = (mysql) => {
    return new dbConnection(mysql)
}