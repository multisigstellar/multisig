var bookshelf = require('../config/bookshelf');


var Signer = bookshelf.Model.extend({
  tableName: 'signers',
  hasTimestamps: true,
});


module.exports = Signer;
