var app = require('./index.js');
const axios = require('axios');

module.exports = {
  
  passwordLogin: (req, res) => {
    const db = app.get('db');
    let {username, password} = req.body;
    db.passwordLogin([username, password])
    .then( user => {
      if (user[0]){
        req.session.isLoggedIn = true;
        req.session.username = user[0].username;
        req.session.userId = user[0].id;
        return res.status(200).send({status: 'success', username: user[0].username});
      }else{
        return res.status(200).send({status: 'error', message: 'no account found with that username and password'});
      }
    })
    .catch(err => console.log(err));
  },

  isLoggedIn: (req, res) => {
    if (req.session.isLoggedIn){
      return res.status(200).send({isLoggedIn: true, username: req.session.username});
    }else{
      return res.status(200).send({isLoggedIn: false});
    }
  },

  createProfile: (req, res) => {
    const db = app.get('db');
    let { image, username, password } = req.body;

    if (!image || !username || !password){
      return res.status(200).send({status: 'error', message: 'missing some profile info, please try again'});
    }

    db.createProfile([username, password])
    .then( response => {
      if (response[0].id){
        // this means we created the profile in the database, now we need to enroll this user in the kairos api gallery
        let id = response[0].id;
        let config = require('./config.js');
        let payload = {
          "image": image
        }
        
        let requestConfig = {
          method: 'POST',
          url: 'https://api.kairos.com/enroll',
          headers: {
            "Content-type": "application/json",
            "app_id": config.fr.id,
            "app_key": config.fr.key,
          },
          data: {
            image: image,
            gallery_name: 'frusers',
            subject_id: JSON.stringify(id)
          }
        }
        
        axios(requestConfig)
        .then(response2 => {
          if (response2.data.face_id || !response2.data.Errors){
            return res.status(200).send({status: 'success', message: 'successfully created profile'});
          }
        })
        .catch(err=>console.log(err));
      }
    })
    .catch(err => console.log(err));
  }
    
  
};
