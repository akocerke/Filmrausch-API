const { DataTypes } = require('sequelize');
const sequelize = require('../setup/database');

const Favorites = sequelize.define('Favorites', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  movie_id: {
    type: DataTypes.INTEGER,
    allowNull: true 
  },
  series_id: {
    type: DataTypes.INTEGER,
    allowNull: true 
  }
});

module.exports = Favorites;
