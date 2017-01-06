var config = require('config');

var User = require('./user/user.service');
var Tx = require('./tx/tx.service');
var Signer = require('./signer/signer.service');


module.exports = {
  configure: function(app) {



    app.post('/saveuser',  function(req, res) {
        
        User.save(req, res);
          
    });

    app.post('/savetx',  function(req, res) {
        
        Tx.save(req, res);
          
    });    

    app.post('/signtx',  function(req, res) {
        
        Tx.sign(req, res);
          
    });  

    app.post('/savesigners',  function(req, res) {
        
        Signer.save(req, res);
          
    });    

    app.get('/gettx/:tx_tag',  function(req, res) {
        
        Tx.getTx(req, res);
          
    }); 

    app.get('/submittx/:tx_tag',  function(req, res) {
        
        Tx.submitTx(req, res);
          
    });     

    app.get('/gettxlist/:limit',  function(req, res) {
        
        console.log("PARAMS: ", req.params.limit);
        Tx.getTxList(req, res);
          
    });     

  }
};


