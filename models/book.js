'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a value for 'Title'",
        },
        notEmpty: {
          msg: "Please provide a value for 'Title'",
        }
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a value for 'Author'",
        },
        notEmpty: {
          msg: "Please provide a value for 'Author'",
        }
      },
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  return Book;
};