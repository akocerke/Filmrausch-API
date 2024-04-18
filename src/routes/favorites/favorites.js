const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const Favorites = require('../../database/models/favorites');

const FavoritesRouter = Router();

// Handler für GET-Anfrage auf /all
FavoritesRouter.get("/all", async (req, res) => {
  try {
    // Alle Favoriten aus der Datenbank abrufen
    const favorites = await Favorites.findAll();

    // Überprüfen, ob Favoriten vorhanden sind
    if (favorites.length === 0) {
      console.log("Keine Favoriten gefunden.");
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Keine Favoriten gefunden." });
    }

    // Wenn Favoriten vorhanden sind, senden Sie sie als Antwort
    console.log("Alle Favoriten gefunden.");
    res.status(StatusCodes.OK).json({ message: "Alle Favoriten gefunden.", favorites: favorites });
  } catch (error) {
    // Fehler beim Abrufen der Favoriten behandeln
    console.error("Fehler beim Abrufen aller Favoriten:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fehler beim Abrufen aller Favoriten." });
  }
});
// GET-Anfrage, um alle Favoriten eines Benutzers anhand der Benutzer-ID zurückzugeben
FavoritesRouter.get("/byUserId/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Favoriten aus der Datenbank abrufen, die zur Benutzer-ID gehören
    const userFavorites = await Favorites.findAll({ where: { user_id: userId } });

    if (userFavorites.length === 0) {
      console.log(`Keine Favoriten gefunden für Benutzer mit der ID ${userId}`);
      return res.status(StatusCodes.NOT_FOUND).json({ message: `Keine Favoriten gefunden für Benutzer mit der ID ${userId}` });
    }

    // Extrahiere nur die movie_id aus den Favoriten
    const movieIds = userFavorites.map(favorite => favorite.movie_id);

    console.log(`Favoriten gefunden für Benutzer mit der ID ${userId}`);
    res.status(StatusCodes.OK).json({ message: `Favoriten gefunden für Benutzer mit der ID ${userId}`, movieIds: movieIds });
  } catch (error) {
    console.error(`Fehler beim Abrufen der Favoriten für Benutzer mit der ID ${userId}:`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Fehler beim Abrufen der Favoriten für Benutzer mit der ID ${userId}.` });
  }
});
module.exports = FavoritesRouter;
