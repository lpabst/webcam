var app = require('./index.js');

module.exports = {
  
  passwordLogin: (req, res) => {
    const db = app.get('db');
    console.log(req.body);
  },
    
  
};
