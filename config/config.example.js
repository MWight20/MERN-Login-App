// Copy this file as config.js in the same folder, with the proper database connection URI.

module.exports = {
  db: 'mongodb://username:password@url:port/db',
  //db: 'mongodb://WightAdmin:WightAdmin@wight-shard-00-00-jqpqo.mongodb.net:27017,wight-shard-00-01-jqpqo.mongodb.net:27017,wight-shard-00-02-jqpqo.mongodb.net:27017/myDB?replicaSet=Wight-shard-0&ssl=true',
  db_dev: 'mongodb://url:27017/login_demo',
};
