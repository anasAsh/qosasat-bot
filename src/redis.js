const config = require('config');
const redis = require('redis');

const client = require('redis').createClient(process.env.REDIS_URL || config.get('redisUrl'));

const setNextIntent = (senderId, nextIntent) => {
  console.log('will set next intent to:', nextIntent);
  client.set(`nextIntent:${senderId}`, JSON.stringify(nextIntent));
}

module.exports = {
  setNextIntent: setNextIntent,
  getNextIntent: (senderId) => {
    return new Promise((resolve) => {
      client.get(`nextIntent:${senderId}`, function(err, reply) {
        console.log('will reply', reply);
        setNextIntent(senderId, {});
        resolve(JSON.parse(reply));
      });
    });
  }
}
