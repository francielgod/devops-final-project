const sqlite3 = require('sqlite3').verbose();

const dbSource = process.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite';

const db = new sqlite3.Database(dbSource, (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log(`Conectado a la base de datos SQLite (${dbSource}).`);
        
       
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0
        )`);
    }
});

module.exports = db;