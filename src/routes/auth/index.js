// auth/index.js
const { Router } = require("express");
const Users = require("../../database/models/users");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const AuthRouter = Router();

// Beispiel-Endpunkte für die Authentifizierung

AuthRouter.post("/login", async (req, res, next) => {
  // Handle login logic
  try {
    const { username, password } = req.body; // Zugriff auf die Anmeldedaten im Anfragekörper
    const user = await Users.findOne({
      where: { username: username },
    }); // Benutzer anhand der E-Mail-Adresse finden
    if (!user) {
      // Benutzer nicht gefunden
      return res.status(401).json({
        message: "Login nicht erfolgreich",
        error: "Benutzer nicht gefunden",
      });
    }
    // Passwort überprüfen
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Passwort stimmt nicht überein
      return res.status(401).json({
        message: "Login nicht erfolgreich",
        error: "Ungültige Anmeldeinformationen",
      });
    }
    res.status(200).json({
      message: "Login erfolgreich",
      user: {
        username: user.username,
        // password: user.password,
      },
    });
  } catch (error) {
    // Fehler bei der Verarbeitung der Anfrage
    res.status(500).json({
      message: "Ein Fehler ist aufgetreten",
      error: error.message,
    });
  }
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
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Benutzername bereits vergeben. Bitte wählen Sie einen anderen Benutzernamen.",
      });
    }

    // Falls nicht, hashen Sie das Passwort
    const hashedPassword = await bcrypt.hash(password, 10);

    // Fügen Sie den neuen Benutzer zur Datenbank hinzu
    const newUser = await Users.create({
      username: username,
      password: hashedPassword,
    });

    // Erfolgreiche Antwort senden
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Benutzer erfolgreich registriert.", user: newUser });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Fehler bei der Registrierung. Bitte versuchen Sie es erneut.",
    });
  }
});
AuthRouter.post("/logout", (req, res) => {
  // Handle logout logic
});

module.exports = { AuthRouter };
