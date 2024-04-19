const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { AppRouter } = require("./src/routes");

// Zugriff auf Umgebungsvariablen
const { PORT } = process.env;

// Initialisierung von express
const app = express();
app.use(bodyParser.json());
// Use for development
app.use(cors());

app.use("/filmrausch", AppRouter);

// App hört im folgenden auf den Port, welcher über die Umgebungsvariable definiert ist
app.listen(PORT, () => {
  console.log(`Filmrausch app listening on port ${PORT}`);
});