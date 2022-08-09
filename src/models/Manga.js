const mongoose = require('mongoose');

const mangaSchema = mongoose.Schema({
     id: {
          type: String,
          required: true,
          unique: true
     },
     email: {
          type: String,
     },
     title: {
          type: String,
          required: true,
     },
     image: {
          type: String,
          default: "",
     },
     synopsis: {
          type: String,
          required: true,
     },
     alt: {
          type: String,
          default: "",
     },
     status: {
          type: String,
          required: true,
     },
     lastupdated: {
          type: Date,
          default: Date.now,
     },
     rating: {
          type: Array,
          default: [],
     },
     totalVoted: {
          type: Array,
          default: [],
     },
     genres: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Genre'
     },
     authors: {
          type: String,
          required: true,
     },
     views: {
          type: Array,
          default: [],
     },
},
     {
          timestamp: true,
     }
);

mangaSchema.set("toJSON", {
     transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString();
          delete returnedObject._id;
          delete returnedObject.__v;
     }
});

module.exports = mongoose.model("Manga", mangaSchema);