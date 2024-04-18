// auth/index.js
const { Router } = require("express");
const Users = require('../../database/models/users');
const bcrypt = require('bcrypt');
const { StatusCodes } = require("http-status-codes");


const AuthRouter = Router();

// Beispiel-Endpunkte für die Authentifizierung
AuthRouter.post("/login", (req, res) => {
  // Handle login logic
});

// Benutzerregistrierung 
AuthRouter.post("/register", async (req, res) => {
  // Handle register logic
  try {
    const { username, password } = req.body;

    // Überprüfen, ob der Benutzer bereits vorhanden ist
    const existingUser = await Users.findOne({ where: { username: username } });

    // Wenn der Benutzer bereits vorhanden ist, senden Sie eine Fehlermeldung an den Client
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Benutzername bereits vergeben. Bitte wählen Sie einen anderen Benutzernamen." });
    }

    // Falls nicht, hashen Sie das Passwort
    const hashedPassword = await bcrypt.hash(password, 10);

    // Fügen Sie den neuen Benutzer zur Datenbank hinzu
    const newUser = await Users.create({ username: username, password: hashedPassword });

    // Erfolgreiche Antwort senden
    res.status(StatusCodes.CREATED).json({ message: "Benutzer erfolgreich registriert.", user: newUser });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fehler bei der Registrierung. Bitte versuchen Sie es erneut." });
  }
});
AuthRouter.post("/logout", (req, res) => {
  // Handle logout logic
});

module.exports = { AuthRouter };
