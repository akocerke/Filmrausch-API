// auth/index.js
const { Router } = require("express");
const Users = require("../../database/models/users");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken');

const AuthRouter = Router();


// Login Funktion mit token
AuthRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });
    if (!user) {
      return res.status(401).json({ message: "Benutzer nicht gefunden" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Ungültige Anmeldeinformationen" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'secretKey',  // Sie sollten einen sicheren Schlüssel verwenden und in Umgebungsvariablen speichern
      { expiresIn: '1h' }  // Token-Gültigkeit
    );

    res.status(200).json({ message: "Login erfolgreich", token: token });
  } catch (error) {
    res.status(500).json({ message: "Ein Fehler ist aufgetreten", error: error.message });
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


// Logout Funktion mit roken inkl console.log
AuthRouter.post("/logout", (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Token received for logout:", token);  // Log the token when received

  if (token) {
    jwt.verify(token, 'secretKey', (err, user) => {
      if (err) {
        console.log("Token verification failed:", err);
        return res.sendStatus(403); // Bei ungültigem Token
      }

      console.log(`Logout requested by user ID: ${user.id}`); // Hier loggen wir die Benutzer-ID
      res.status(200).json({ message: "Erfolgreich ausgeloggt" });
    });
  } else {
    console.log("No token provided for logout");
    res.status(401).json({ message: "No token provided" });
  }
});





module.exports = { AuthRouter };
