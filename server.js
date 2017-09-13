// Import libraries and frameworks 
const express = require('express'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      path = require("path"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      // flash = require("connect-flash"),
      session = require("express-session"),
      cookieParser = require("cookie-parser");

// Set mongoose promises to global promises (mongoose promises are deprecated)
mongoose.Promise = global.Promise;

// Enable env variables
require('dotenv').config();

// Initialize server
const app = express();

// require("./vendors/passport")(passport);

// Logging
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser());

const Vendor = require('./backend/models/vendor');
const User = require('./backend/models/user');
const mock = require('./backend/models/vendor_mock');
const foodRouter = require('./backend/routes/food_routes');

// require("./vendors/routes/routes")(app, path, passport);
app.use('/food', foodRouter);

// app.get('/test', (req,res) => {
//   console.log('hello');
//   return res.status(200).send("hello");
// });

const dbConnection = (dbUrl=process.env.DB_URL) => {
  return mongoose.connect(dbUrl, {useMongoClient: true})
    .then( () => {
      console.log('Mongoose connection to bravesDb active.');
      return Vendor.find()
      //  .then( (result) => console.log('now in the db:', JSON.stringify(result, null, 2) ));
    })
    .catch(err => console.log(err));
};


let server;
// console.log('PROCESS',process.env)
const runServer = (port=process.env.PORT) => {
  return new Promise( (resolve, reject) => {
    
    resolve(server = app.listen(port, () => {
      console.log(`The server is running on port ${port}`);
    }));
  
  });
};

const closeServer = () => {
  
  return mongoose.disconnect()
    .then( () => { 
      console.log('mongoose disconnecting');
      return new Promise( (resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            reject(err);
            return;
          } 
          resolve();
        });
      }); 
    });
  };


if (require.main === module ) {
  runServer()
  .then( () => {
    dbConnection();

  })
.catch( (err) => console.log(err));
}

