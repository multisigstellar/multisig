var dbConfig = require('./database');

var knex = require('knex')({
											client: 'mysql',
											connection: dbConfig
										});
module.exports = require('bookshelf')(knex);
