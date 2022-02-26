//loads the express framework
const express = require('express')
const app = express()

//imports middleware libraries
const morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');
 
//array of objects that contain movie data
let top10Movies = [
    {
      title: 'Forrest Gump',
      director: 'Robert Zemeckis'
    },
    {
      title: 'American Me',
      director: 'Edward James Olmos'
    },
    {
      title: 'Saving Private Ryan',
      director: 'Steven Spielberg'
    },
    {
      title: 'Pulp Fiction',
      director: 'Quentin Tarantino'
    },
    {
      title: 'Kill Bill',
      director: 'Quentin Tarantino'
    },
    {
      title: 'Once Upon a Time in Hollywood',
      director: 'Quentin Tarantino'
    },
    {
      title: 'Blood in Blood Out',
      director: 'Taylor Hackford'
    },
    {
      title: 'Titanic',
      director: 'James Cameron'
    },
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      director: 'Chris Columbus'
    },
    {
      title: 'Guardians of the Galaxy',
      director: 'James Gunn'
    }
  ];

  //returns a list of all movies 
  app.get('/movies', (req, res) => {
    res.json(top10Movies);      
  });

  //gets a welcome message for the directory '/'
  app.get('/', (req, res) => {
    res.send('Check out my top ten movies!');
  });

  //
  app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  //serves static content from the 'public' directory
  app.use(express.static('public')); 

  //logs request data using the moorgan middleware library
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

  //listens to port 8080
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');   
  });