const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.log('Could not connect to database', err)
    } else {
        console.log('Connected to database')
    }
});

const tableSql = `CREATE TABLE  IF NOT EXISTS users
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username text NOT NULL,
                    password text NOT NULL)`;  
const usersSql = `INSERT INTO users(username, password) VALUES 
('Fran','Lozinka'),
('Ivan','password'),
('RPPP','b910459hvpdfh-j9g5')`;                   

db.run(tableSql,(err,result)=>{
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of the 'inventory' table");
    db.run(usersSql,(err,result)=>{
        if (err) {
            return console.error(err.message);
        }
        console.log("Seeded users table");
    
    })
    db.all(`select * from users`,[],(err,result)=>{
        if (err) {
            return console.error(err.message);
        }
        console.log('Done')
        result.forEach((row)=>{console.log(row)})
    })
})


module.exports = db