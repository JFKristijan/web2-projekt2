const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.log('Could not connect to database', err)
    } else {
        console.log('Connected to database')
    }
});

const tableSqli = `CREATE TABLE  IF NOT EXISTS users
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username text NOT NULL,
                    email text NOT NULL,
                    credit_card text NOT NULL,
                    password text NOT NULL);
                    `;  
const tableSql = `
CREATE TABLE  IF NOT EXISTS statuses
(id INTEGER PRIMARY KEY AUTOINCREMENT,
username text NOT NULL,
status text NOT NULL);`

const usersSql = `INSERT INTO users(username,email,credit_card, password) VALUES 
('Tll6','vrucidr@gmail.cm','123456789','Lozinka'),
('qwert','mlakidr@gmail.cm','987654321','password'),
('azer','hladnidr@gmail.cm','123789456','b910459hvpdfh-j9g5'),
('Kijewski', 'Kijewski@gmail.com', '757554437701', 'JYAQZVOUPBXU'),
('Mark', 'Mark Pollock@gmail.com', '086500289279', 'IXYRQRVEHNZT'),
('WiffleBird', 'WiffleBird@gmail.com', '171923340646', 'XMTAVRWGDQCM'),
('Matthews', 'secretchimp69@gmail.com', '298176315638', 'GSTUWOWWEAHL'),
('LadyeCatte', 'mizzcatt@gmail.com', '283757825824', 'GKRVHHCRTVKN'),
('RPG Mom', 'RPG Mom@gmail.com', '030266074287', 'IEVPLUHKHFUL'),
('John', 'JohnE@gmail.com', '716554316184', 'UUULUTYHLRYT'),
('Vesko', 'VeskoGavrilov@gmail.com', '971011873566', 'DZTYPRKLITGX'),
('Wolf22', 'WingedWolf22@gmail.com', '254989884237', 'MAITIHOJKWAR'),
('Bruce Gray', 'BruceGray@gmail.com', '759975700612', 'GOVLPZWBEPHN'),
('Brian S', 'BrianSPratt.@gmail.com', '545783874695', 'NSJZBXTGNKBS'),
('Rene', 'ReneSHoepelmanJr@gmail.com', '188963295422', 'IAQOTOHKXLVS'),
('Beyond', 'ReneBeyond@gmail.com', '406849281215', 'IASYXTOBJDER');`;            

const statusSql = `INSERT INTO statuses(username,status) VALUES 
('Fran','Ovo je moj prvi demo status :\)')
` 


db.run(tableSql,(err,result)=>{
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of the 'statuses' table");
    db.run(statusSql,(err,result)=>{
        if (err) {
            return console.error(err.message);
        }
        console.log("Seeded statuses table");
    
    })
});

db.run(tableSqli,(err,result)=>{
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of the 'users' table");
    db.run(usersSql,(err,result)=>{
        if (err) {
            return console.error(err.message);
        }
        console.log("Seeded users table");
    
    })
    // db.all(`select * from users`,[],(err,result)=>{
    //     if (err) {
    //         return console.error(err.message);
    //     }
    //     console.log('Done')
    //     result.forEach((row)=>{console.log(row)})
    // })
})


module.exports = db