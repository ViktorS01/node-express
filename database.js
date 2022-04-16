const sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE note (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date text, 
            text text UNIQUE, 
            title text, 
            tag text
            )`,
            (err) => {
                if (err) {
                    // Table already created
                    console.log('1')
                }else{
                    // Table just created, creating some rows
                    const insert = 'INSERT INTO note (date, text, title, tag) VALUES ($date, $text, $tag, $title)'
                    db.run(insert, [new Date().toString(), "Купить", "Купить игрушку", "Покупки"])
                    db.run(insert, [new Date().toString(), "Продать", "Продать гараж", "Продажи"])
                }
            });
        db.run(`CREATE TABLE tag (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text text UNIQUE
            )`,
            (err) => {
                if (err) {
                    // Table already created
                    console.log('2')
                }else{
                    // Table just created, creating some rows
                    const insert = 'INSERT INTO tag (text) VALUES ($text)'
                    db.run(insert, ["Спорт"])
                    db.run(insert, ["Продажа"])
                    db.run(insert, ["Покупка"])
                }
            });
    }
});


module.exports = db