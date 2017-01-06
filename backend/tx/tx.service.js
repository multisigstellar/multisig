var bookshelf = require('../config/bookshelf');
var Tx = require('./tx.model');
var User = require('../user/user.model');
var Signer = require('../signer/signer.model');
var signerCollection = bookshelf.Collection.extend({
  model: Signer
});
var userObj = {};
var txObj = {};
var signers = [];
var signComplete = 0;

module.exports = {


  save: function (req, res) {

    User.forge({account_id: req.body.srcAcct}).fetch()
        .then(function(model) {
            if (!model) {
              console.log('User not found. Save User');
              var newUser  = new User({
                                    email: req.body.email, 
                                    account_id: req.body.srcAcct
                                    }); 
              //insert new brick in DB
             return newUser.save();
              
            }else{
              return model.save({email: req.body.email}, {patch: true});
              // return User.where('account_id', req.body.srcAcct).save({email: req.body.email}, {patch: true});
                // return User.forge({account_id: req.body.srcAcct}).save({email: req.body.email}, {patch: true});
            }

            
        })
        .then(function(model) {
          userObj = model.toJSON();
          console.log("userObj", userObj);
          
          // Check if transaction already exists
          return Tx.forge({tx_tag: req.body.txTag}).fetch();
          

        })
        .then(function(model) {
            if (!model) {
              console.log('Tx not found. Save new Tx');
              var newTx  = new Tx({
                      user_id: userObj.id,
                      initiator: req.body.srcAcct,
                      tx_xdr: req.body.txString,
                      tx_tag: req.body.txTag,
                      signed: 0,
                      submitted: 0
                      });
              return newTx.save();
            }else{
              console.log('Tx found.');
              var tx = model.toJSON();
              res.status(200).send({status: true, content: {message: 'Tx created successfully', tx: tx}});
              return null;
            }

            
        })
        .then(function(model) {
          // to do save signers
          console.log('Tx created successfully');
          var tx = model.toJSON();
          res.status(200).send({status: true, content: {message: 'Tx created successfully', tx: tx}});
        
        }).catch(function(err){
            console.log(err);
        });
  },

  getTx: function (req, res) {

    Tx.forge({tx_tag: req.params.tx_tag}).fetch()
        .then(function(model) {
            if (!model) {
              console.log('Tx not found.');
              throw new Error("tx not found");

            }else{
              var tx = model.toJSON();
              txObj = tx;
              console.log("tx", tx);
              return signerCollection.query({where: {tx_id: tx.id}}).fetch();

            }
          
            
        })
        .then(function(models) {

             txObj.signers = models.toJSON();
             console.log("signers model", models.toJSON());
            res.status(200).send({status: true, content: {message: 'Transaction retrieved successfully',tx: txObj}});
        })
        .catch(function(err){
            console.log(err);
            res.status(404).send({status: false, content: {message: 'Transaction not found'}});
        });
  },

  getTxList: function (req, res) {

    Tx.forge({}).fetchAll()
        .then(function(model) {
            if (!model) {
              console.log('Tx not found.');
              res.status(404).send({status: false, content: {message: 'Transaction not found'}});
            }else{
              var tx = model.toJSON();

              res.status(200).send({status: true, content: {message: 'Transaction retrieved successfully',tx: tx}});
            }
          // ToDo Get Signers as well
            
        })
        .catch(function(err){
            console.log(err);
        });
  },


  sign: function (req, res) {
    // get signer from signers table
    // set status to signed == 1
    // save signer
    // get all signers for a transaction 
    // if all status is set to signed
    // set transaction status to signed.
    // save in db
    
    Signer.forge({tx_id: req.body.tx_id, account_id: req.body.signer}).fetch()
      .then(function(model) {
        return model.save({signed : 1}, {patch: true});
      })
      .then(function(model) {
        // save tx_xdr
        return Tx.forge({id: req.body.tx_id}).save({tx_xdr: req.body.tx_xdr}, {patch: true});
      })
      .then(function(model){
        
        // get all signers        
        return signerCollection.query({where: {tx_id: req.body.tx_id}}).fetch();

      })
      .then(function(models){

        signComplete = 0;
        models = models.toJSON();
        console.log("models : ", models);
        // save signers in tx object
        signers = models;

        models.forEach(function(m) {
          if (m.signed == 0) {
            signComplete++;
          }
        });
        if (signComplete == 0) {
            // Signing complete
            console.log("calling 1: ", signComplete);
            return Tx.forge({id: req.body.tx_id}).save({signed: 1}, {patch: true});
        }else{
            // 
            // res.status(200).send({status: true, content: {message: 'Signed successfully. '+signComplete+' signatures pending'}});
            console.log("calling 2: ", signComplete);
            return Tx.forge({id: req.body.tx_id}).fetch();
        }

      })
      .then(function(model) {
        // save updated transaction
        txObj = model.toJSON();
        txObj.signers = signers
        res.status(200).send({status: true, content: {message: 'Signing complete'+signComplete+' signatures pending', tx: txObj}});
      })
      .catch(function(err){
            console.log(err);
            res.status(404).send({status: false, content: {message: 'Failed to update signers'}});
      });

  },  

  submitTx: function (req, res) {

    Tx.forge({tx_tag: req.params.tx_tag}).fetch()
      .then(function(model) {
        return model.save({submitted: 1}, {patch: true});
      })
      .then(function(model) {
        
        txObj = model.toJSON();
        txObj.signers = signers
        res.status(200).send({status: true, content: {message: 'Data retrieved', tx: txObj}});
      })
      .catch(function(err){
            console.log(err);
            res.status(404).send({status: false, content: {message: 'Failed to update tx data'}});
      });

  },   



};

