const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var massive = require('massive');
var session = require('express-session');
var config = require('./config.js');
const requestify = require('requestify');
const axios = require('axios');

const app = module.exports = express();

app.use(bodyParser.json());
app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: (1000 * 60 * 60 * 24 * 14) //this is 14 days
  }
}))

// massive(config.connection)
// .then( db => {
//   app.set('db', db);
// })

app.use(express.static(__dirname + './../build'))

var userController = require("./userController.js");

//////////Endpoints for the front end
app.post('/api/facialRecognition', (req, res) => {
  let { url, payload } = req.body;

  let requestConfig = {
    method: 'POST',
    url: url,
    headers: {
      "Content-type": "application/json",
      "app_id": config.fr.id,
      "app_key": config.fr.key,
    },
    data: {
      data: JSON.stringify(payload),
      dataType: 'text',
      image: payload.image
    }
    
  }
  
  axios(requestConfig)
    .then(response => {
      return res.status(200).send(response.data);
    })
    .catch(err=>console.log(err));

})



app.listen(config.port, console.log("you are now connected on " + config.port));
