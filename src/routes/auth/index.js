// auth/index.js
const express = require("express");
const { Router } = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { AppRouter } = require("..");

const AuthRouter = Router();
AuthRouter.use(bodyParser.json());
// Beispiel-Endpunkte für die Authentifizierung
AuthRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Consultar la base de datos para verificar las credenciales del usuario
  const sql = `SELECT * FROM filmrausch WHERE username = ? AND password = ?`;
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Error al consultar la base de datos:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    // Verificar si se encontró un usuario con el nombre de usuario proporcionado
    if (result.length === 0) {
      res.status(401).send("Nombre de usuario incorrecto");
      return;
    }

    // Verificar si la contraseña coincide
    if (result[0].password === password) {
      res.status(200).send("Inicio de sesión exitoso");
    } else {
      res.status(401).send("Contraseña incorrecta");
    }
  });
});

AuthRouter.post("/register", (req, res) => {
  // Handle registration logic
});

AuthRouter.post("/logout", (req, res) => {
  // Handle logout logic
});

module.exports = { AuthRouter };
