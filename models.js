const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {Type: String, required: true},
    Description: {Type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
Director: {
        Name: String,
        Bio: String,
        Birth: String,
        Death: String
    },
Actors: [String],
ImagePath: String, 
Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });
  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;