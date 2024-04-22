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
    const movieIds = userFavorites.map(favorite => favorite.movie_id).filter(movieId=>movieId);
    const seriesIds = userFavorites.map(favorite => favorite.series_id).filter(seriesId=>seriesId);

    console.log(`Favoriten gefunden für Benutzer mit der ID ${userId}`);
    res.status(StatusCodes.OK).json({ message: `Favoriten gefunden für Benutzer mit der ID ${userId}`, movieIds: movieIds, seriesIds: seriesIds });
  } catch (error) {
    console.error(`Fehler beim Abrufen der Favoriten für Benutzer mit der ID ${userId}:`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Fehler beim Abrufen der Favoriten für Benutzer mit der ID ${userId}.` });
  }
});

// POST-Anfrage, um eine Movie-ID oder Serie-ID zu den Favoriten eines Benutzers hinzuzufügen
FavoritesRouter.post("/add", async (req, res) => {
  const { userId, movieId, seriesId } = req.body;

  try {
    // Überprüfen, ob bereits ein Favorit mit der angegebenen userId und movieId oder seriesId vorhanden ist
    const existingFavorite = await Favorites.findOne({ where: { user_id: userId, [movieId ? 'movie_id' : 'series_id']: movieId || seriesId } });

    // Wenn ein Favorit bereits vorhanden ist, senden Sie eine Fehlermeldung an den Client
    if (existingFavorite) {
      const itemType = movieId ? 'Movie' : 'Serie';
      console.log(`Der Favorit mit der ${itemType}-ID ${movieId || seriesId} ist bereits den Favoriten des Benutzers mit der ID ${userId} hinzugefügt.`);
      return res.status(StatusCodes.BAD_REQUEST).json({ message: `Der Favorit mit der ${itemType}-ID ${movieId || seriesId} ist bereits den Favoriten des Benutzers mit der ID ${userId} hinzugefügt.` });
    }

    // Wenn kein Favorit gefunden wurde, fügen Sie den neuen Favoriten hinzu
    const newItemType = movieId ? 'Movie' : 'Serie';
    const newFavorite = await Favorites.create({ user_id: userId, [movieId ? 'movie_id' : 'series_id']: movieId || seriesId });

    console.log(`${newItemType} mit der ID ${movieId || seriesId} wurde zu den Favoriten des Benutzers mit der ID ${userId} hinzugefügt.`);
    res.status(StatusCodes.CREATED).json({ message: `${newItemType} mit der ID ${movieId || seriesId} wurde zu den Favoriten des Benutzers mit der ID ${userId} hinzugefügt.`, newFavorite: newFavorite });
  } catch (error) {
    const itemType = movieId ? 'Movie' : 'Serie';
    console.error(`Fehler beim Hinzufügen von ${itemType} mit der ID ${movieId || seriesId} zu den Favoriten des Benutzers mit der ID ${userId}:`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Fehler beim Hinzufügen von ${itemType} mit der ID ${movieId || seriesId} zu den Favoriten des Benutzers mit der ID ${userId}.` });
  }
});

// DELETE-Anfrage, um einen Favoriten anhand von Benutzer-ID und Film-ID oder Serien-ID zu löschen
FavoritesRouter.delete("/delete", async (req, res) => {
  const { userId, movieId, seriesId } = req.body;

  try {
    // Favorit aus der Datenbank löschen, der zur Benutzer-ID und Film-ID oder Serien-ID gehört
    const deletedFavorite = await Favorites.destroy({ where: { user_id: userId, [movieId ? 'movie_id' : 'series_id']: movieId || seriesId } });

    if (deletedFavorite === 0) {
      const itemType = movieId ? 'Film' : 'Serie';
      console.log(`Kein ${itemType}-Favorit gefunden für Benutzer mit der ID ${userId} und ${itemType === 'Film' ? 'Film' : 'Serie'} mit der ID ${movieId || seriesId}`);
      return res.status(StatusCodes.NOT_FOUND).json({ message: `Kein ${itemType}-Favorit gefunden für Benutzer mit der ID ${userId} und ${itemType === 'Film' ? 'Film' : 'Serie'} mit der ID ${movieId || seriesId}` });
    }

    const itemType = movieId ? 'Film' : 'Serie';
    console.log(`${itemType}-Favorit für Benutzer mit der ID ${userId} und ${itemType === 'Film' ? 'Film' : 'Serie'} mit der ID ${movieId || seriesId} wurde erfolgreich gelöscht.`);
    res.status(StatusCodes.OK).json({ message: `${itemType}-Favorit für Benutzer mit der ID ${userId} und ${itemType === 'Film' ? 'Film' : 'Serie'} mit der ID ${movieId || seriesId} wurde erfolgreich gelöscht.` });
  } catch (error) {
    const itemType = movieId ? 'Film' : 'Serie';
    console.error(`Fehler beim Löschen des ${itemType}-Favoriten für Benutzer mit der ID ${userId} und ${itemType === 'Film' ? 'Film' : 'Serie'} mit der ID ${movieId || seriesId}:`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Fehler beim Löschen des ${itemType}-Favoriten für Benutzer mit der ID ${userId} und ${itemType === 'Film' ? 'Film' : 'Serie'} mit der ID ${movieId || seriesId}.` });
  }
});

module.exports = FavoritesRouter;
