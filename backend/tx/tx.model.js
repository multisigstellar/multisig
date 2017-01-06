var bookshelf = require('../config/bookshelf');


var Tx = bookshelf.Model.extend({
  tableName: 'transactions',
  hasTimestamps: true,
});


module.exports = Tx;
