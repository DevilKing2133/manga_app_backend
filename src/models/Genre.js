const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
     genre: {
          type: String,
          required: true,
          unique: true
     },
});

// Exporting our model objects
module.exports = mongoose.model("Genre", genreSchema);