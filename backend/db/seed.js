const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const seedPath = path.join(__dirname, 'seed.sql');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath);

// Ler o arquivo seed.sql
const seedSQL = fs.readFileSync(seedPath, 'utf8');

// Executar o script
db.serialize(() => {
    db.exec(seedSQL, (err) => {
        if (err) {
            console.error('Erro ao executar seed:', err);
        } else {
            console.log('Seed executado com sucesso!');
        }
        db.close();
    });
}); 