const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const Users = require("../../database/models/users");

const UsersRouter = Router();

// GET-Anfrage für alle Benutzer
UsersRouter.get("/all", async (req, res) => {
  try {
    // Alle Benutzer aus der Datenbank abrufen
    const users = await Users.findAll();

    // Überprüfen, ob Benutzer vorhanden sind
    if (users.length === 0) {
      console.log("Keine Benutzer gefunden.");
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Keine Benutzer gefunden." });
    }

    // Wenn Benutzer vorhanden sind, senden Sie sie als Antwort
    console.log("Alle Benutzer gefunden.");
    res.status(StatusCodes.OK).json({ message: "Alle Benutzer gefunden.", users: users });
  } catch (error) {
    // Fehler beim Abrufen der Benutzer behandeln
    console.error("Fehler beim Abrufen aller Benutzer:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fehler beim Abrufen aller Benutzer." });
  }
});


module.exports = { UsersRouter };
