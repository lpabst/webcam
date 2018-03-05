var app = require('./index.js');

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
    
  
};
