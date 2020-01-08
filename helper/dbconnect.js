/**
 * Importing Mysql Moule
 */
const mysql = require('mysql');
/**
 * I created custon Json datanase credentials
 * & import to here for mysql data base connect
 */
const db_config = require('../helper/database.json');
/**
 * mysql connection Method
 */
var con = mysql.createConnection({
    host: db_config.local.host_name,
    database: db_config.local.db_name,
    user: db_config.local.db_user,
    password: db_config.local.db_password
})
/**
 * i am setting this conection for global usage
 */
global.con = con;
/**
 * Connect to mysql server usong connect 
 * if wrong in connection method like(db name,password,user)
 * it will throw error 
 * else
 * connect to db
 */
con.connect(function (err, result) {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log("Database Connected !");
    }
})
/**
 * Exporting the Connection 
 */
module.exports = con;