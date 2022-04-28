//loads the express framework, middleware libraries, and add-ons
const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myMovie-api', { useNewUrlParser: true, useUnifiedTopology: true });
    
const methodOverride = require('method-override');

  //body-parser middleware function
  app.use(bodyParser.json());
  
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(express.static('public')); 

  //Requires passport authentication
  let auth = require('./auth')(app);
  const passport = require('passport');
  require('./passport');

  //logs requests to server
  app.use(morgan('common'));

  //serves static content from the 'public' directory
  app.use("/documentation", express.static('public'));

  app.use(methodOverride());

  //handles errors
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error');
  });

  //Returns a list of all movies
  app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find().then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status (500).send("Error: " + err);
    });
  });

  //Returns data about a single movie by title to the user
  app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({Title: req.params.Title})
    .then((movie) => {
      if (movie) { 
        res.status(200).json(movie);
      } else {
        res.status(400).send('Movie not found');
      };
    })
    .catch((err) => {
      res.status(500).send('Error: ' + err);
    });
});

  //Returns data about a genre by name/title (e.g., "Thriller")
  app.get('/movies/Genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name }) // Find one movie with the genre by genre name
      .then((movie) => {
        if (movie) { // If a movie with the genre was found, return json of genre info, else throw error
          res.status(200).json(movie.Genre);
        } else {
          res.status(400).send('Genre not found');
        };
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  });
  
  //Returns data about a director by name
  app.get('/movies/Director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name }) // Find one movie with the director by name
      .then((movie) => {
        if (movie) { // If a movie with the director was found, return json of director info, else throw error
          res.status(200).json(movie.Director);
        } else {
          res.status(400).send('Director not found');
        };
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  });

//Returns a list of all users
app.get("/users", passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.find()
  .then(function (users) {
    res.status(200).json(users);
  })
  .catch(function (err) {
    console.error(err);
    res.status(500).send ("Error: " + err);
  });
});

  // READ: Return data on a single user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (user) { // If a user with the corresponding username was found, return user info
        res.status(200).json(user);
      } else {
        res.status(400).send('User with the username ' + req.params.Username + ' was not found');
      };
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  //Allows users to register, creates a new user profile
  app.post("/users", (req, res ) => {
    Users.findOne({Username: req.body.Username})
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists")
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
          FavoriteMovies: req.body.FavoriteMovies
        })
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
  });
  

  //Allows users to update their info
  app.put("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res ) => {
    Users.findOneAndUpdate(
      {Username: req.params.Username},
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birth: req.body.Birth,
        },
      },
      //Makes sure the updated document is returned
      {new: true},
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      });
  });

  //Adds a movie to the list of a user's list of favorites
  app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, // Find user by username
      { $push: { FavoriteMovies: req.params.MovieID } }, // Add movie to the list
      { new: true }) // Return the updated document
      .then((updatedUser) => {
        res.json(updatedUser); // Return json object of updatedUser
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  //Deletes a movie from a user's list of favorites
  app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, // Find user by username
      { $pull: { FavoriteMovies: req.params.MovieID } }, // Remove movie from the list
      { new: true }) // Return the updated document
      .then((updatedUser) => {
        res.json(updatedUser); // Return json object of updatedUser
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  

   //Deletes a user by username
   app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res ) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + "was not found");
      } else {
        res.status(200).send(req.params.Username + "was deleted");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + err);
    });
  });

  //gets a welcome message for the directory '/'
  app.get('/', (req, res) => {
    res.send('Welcome to myMovie-api!');
  });

  //
  app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
  });

  //listens to port 8080
  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
  });
