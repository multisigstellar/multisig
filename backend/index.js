var express = require('express');
var bodyparser = require('body-parser');
var routes = require('./routes');


var app = express();


app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
  next();
});

routes.configure(app); 


var server = app.listen(8888, function() {
  console.log('Server listening on port ' + server.address().port);
});
