//loads the express framework, middleware libraries, and add-ons
const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  methodOverride = require('method-override');

  //serves static content from the 'public' directory
  app.use(express.static('public'));

  //logs request data using the morgan middleware library
  app.use(morgan('common'));

  //body-parser middleware function
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());

  //handles errors
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('WTF?!');
  });

//array of objects containing users
let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["The Fountain"]
  },
]

//array of objects that contain movie data
let movies = [
    {
      title: "The Fountain",
      description: "As a modern-day scientist, Tommy is struggling with mortality, desperately searching for the medical breakthrough that will save the life of his cancer-striken wife, Izzy.",
      genre: {
        name: "Drama",
        description: "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
      },
      director: {
        name: "Darren Aronofsky",
        bio: "Born on February 12, 1969 in Brooklyn, New York. He was an artistic child, and attended Harvard University to study film. He went on to direct acclaimed movies such as Requiem for a Dream and (2000), The Wrestler (2008), and  Black Swan (2012).",
        birth: 1969.0
      },
      featured: false
    },
    {
      title: "The Princess Bride",
      description: "While home sick in bed, a young boy's grandfather reads him the story of a farmboy-turned-pirate who enconters numerous obstacles, enemies and allies in his quest to be reunited with his love.",
      genre: {
        name: "Action",
        description: "Action is a film genre in which the protagonist or protanonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and franctic chases."
      },
      director: {
        name: "Rob Reiner",
        bio: "After graduating high school, Reiner's parents advised him to participate in Summer Theatre. He got a job as an apprentice in the Bucks County Playhouse in Pennsylvania. He went on to be further edecuated in UCLA Film School. He went on to direct acclaimed movies such as This is Spinal Tap, Stand by Me, and The Princess Bride.",
        birth: 1947.0
      },
      featured: false
    }
  ];

  //Creates a new user profile
  app.post('/users', (req, res ) => {
    const newUser = req.body;

    if (newUser.name) {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser)
    } else {
      res.status(400).send('users need names')
    }
  }) 

  //Updates the user's info
  app.put('/users/:id', (req, res ) => {
    const { id } = req.params;
    const updatedUser = req.body;
    let user = users.find( user => user.id == id);
    if (user) {
      user.name = updatedUser.name;
      res.status(200).json(user);
    } else {
      res.status(400).send('no such user')
    }
  }) 

  //Adds a movie to the list of a user's list of favorites
  app.post('/users/:id/:movieTitle', (req, res ) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
      res.status(400).send('no such user')
    }
  }) 

  //Deletes a movie from a user's list of favorites
  app.delete('/users/:id/:movieTitle', (req, res ) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
      user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
      res.status(400).send('no such user')
    }
  }) 

   //Deletes an existing user's profile
   app.delete('/users/:id', (req, res ) => {
    const { id } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
      users = users.filter( user => user.id != id);
      res.status(200).send(`user ${id} has been deleted`);
    } else {
      res.status(400).send('no such user')
    }
  }) 


  //Returns a list of ALL movies to the user
  app.get('/movies', (req, res) => {
    res.status(200).json(movies);
  });

  //Returns data about a single movie by title to the user
  app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.title === title);

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('no such movie')
    }
  });

  //Returns data about a genre by name/title (e.g., "Thriller")
  app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genre.name === genreName).genre;

    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send('no such genre')
    }
  });

  //Returns data about a director
  app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director.name === directorName).director;

    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send('no such director')
    }
  });

  //gets a welcome message for the directory '/'
  app.get('/', (req, res) => {
    res.send('Check out my top movies!');
  });

  //
  app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
  });

  //listens to port 8080
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
