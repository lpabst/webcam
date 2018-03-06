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
          }else{
            return res.status(200).send({status: 'error', message: 'unable to create profile'});
          }
        })
        .catch(err=>console.log(err));
      }
    })
    .catch(err => console.log(err));
  },

  frLogin: (req, res) => {
    const db = app.get('db');
    let { image, username } = req.body;

    if (!image || !username){
      return res.status(200).send({status: 'error', message: 'missing some profile info, please try again'});
    }

    db.getUserId([username])
    .then( user => {
      if (!user || !user[0] || !user[0].id){
        return res.status(200).send({status: 'error', message: 'No user by that username was found'});
      }else{
        let id = user[0].id;
        let config = require('./config.js');
        
        let requestConfig = {
          method: 'POST',
          url: 'https://api.kairos.com/verify',
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
          if (response2.data.images || !response2.data.Errors){
            let verified = false;

            // verify the person by their photo
            try{
              if (response2.data.images[0].transaction.confidence > 0.5){
                // if confidence is above 0.5, it's the right person
                req.session.isLoggedIn = true;
                req.session.id = id;
                req.session.username = user[0].username;
                return res.status(200).send({status: 'success', message: 'login successful', username: user[0].username});
              }else{
                // if confidence is below 0.5, it isn't the right person
                return res.status(200).send({status: 'error', message: 'unable to verify you by that image. please try again or use the username/password method to login'});
              }
            }catch(e){
              return res.status(200).send({status: 'error', message: 'an error occurred, please try again'});
            }
          }else{
            return res.status(200).send({status: 'error', message: 'an error occurred, please try again'});
          }
        })
        .catch(err=>console.log(err));
      }
    })
    .catch(err=>console.log(err));
  }
    
  
};
