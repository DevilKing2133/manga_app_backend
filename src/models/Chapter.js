const mongoose = require('mongoose');

const chaptersSchema = mongoose.Schema({
     idx: {
          type: String,
          required: true,
          unique: true,
     },
     id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Manga'
     },
     chapterTitle: {
          type: String,
          required: true,
     },
     chapterViews: {
          type: String,
          default: 0,
     },
     uploadedDate: {
          type: Date,
          default: Date.now,
     },
     img: {
          type: String,
          default: "",
     },
});

// Exporting our model objects
module.exports = mongoose.model("Chapter", chaptersSchema);