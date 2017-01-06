var User = require('./user.model');


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
              
              newUser.save().then(function(model) {
                console.log('user created: User name not taken');
                res.status(200).send({status: false, content: {message: 'User saved'}});
              }).catch(function(err){
                console.log(err);
              });

              res.status(404).send({status: false, content: {message: 'Invalid user details'}});
            }else{
              return User.forge({account_id: req.body.srcAcct}).save({email: req.body.email});
            }

            
        })
        .catch(function(err) {
            console.log(err);
            throw new Error('Unable to get account!');
        }).then(function(model) {
          if (!model) {
              console.log('User not found');
              res.status(404).send({status: false, content: {message: 'Invalid user details'}});
            }

            res.status(200).send({status: true, content: {message: 'User saved successfully'}});
        }).catch(function(err) {
            console.log(err);
            res.status(400).send({status: false, content: {message: 'Unable to validate user'}});
        });

    

  },




};

