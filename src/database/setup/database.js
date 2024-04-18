// database.js

const { Sequelize } = require('sequelize');

// Laden der Umgebungsvariablen
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

// Überprüfen der geladenen Umgebungsvariablen
console.log("USERNAME:", DB_USERNAME);
console.log("DB_PASSWORD:", DB_PASSWORD);
console.log("DB_NAME:", DB_NAME);
console.log("DB_HOST", DB_HOST);

// Verbindung zur MySQL-Datenbank herstellen
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD,{
  dialect: 'mysql',
  host: DB_HOST,
  define: {
    // Deaktiviere die Standardzeitstempel (createdAt und updatedAt)
    timestamps: false
  }
});

// Exportieren der Sequelize-Verbindung
module.exports = sequelize;
