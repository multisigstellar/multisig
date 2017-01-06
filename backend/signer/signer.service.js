var Signer = require('./signer.model');
var bookshelf = require('../config/bookshelf');

var signerCollection = bookshelf.Collection.extend({
  model: Signer
});


module.exports = {


  save: function (req, res) {
    // create array of signers
    // 
      var signers = [];

      req.body.signers.forEach(function(s) {
        signers.push({
                    tx_id: req.body.tx_id,
                    email: s.email,
                    account_id: s.accountId,
                    signed: 0
        });
      });

      console.log("signers", signers);

      signerCollection.forge(signers).invokeThen('save')
        .then(function(model) {
          res.status(200).send({status: true, content: {message: 'Signer saved successfully'}});
        }).catch(function(err) {
            console.log(err);
            res.status(400).send({status: false, content: {message: 'Unable to Save Signer'}});
        });

  },




};

