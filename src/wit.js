const config = require('config');
const request = require('request');
const WIT_BASE_URL = process.env.WIT_BASE_URL || config.get('witBaseUrl');
const WIT_AUTH = process.env.WIT_AUTH || config.get('witAuth');

module.exports.get = (text) => {
  const options = {
    url: `${WIT_BASE_URL}&q=${encodeURI(text)}`,
    headers: {
      'Authorization': WIT_AUTH
    }
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
         var witResponse = JSON.parse(body);
         resolve(witResponse);
      }
      reject(error);
    });
  });

};
