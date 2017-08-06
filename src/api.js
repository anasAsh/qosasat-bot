const request = require('request');
const baseurl = 'https://srcsrc.carbon.tools/api/v1/'
module.exports.search = (q) => {
  const url = `${baseurl}photo/search?order=-source_created_at&limit=10&q=${encodeURI(q)}`;
  console.log('will look for images', url);
  const options = {
    url: url
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
         const imagesResponse = JSON.parse(body);
         console.log('imagesResponse', imagesResponse);
         resolve(imagesResponse);
         return;
      }
      reject(error);
    });
  });
};


module.exports.suggest = () => {
  const url = `${baseurl}photo/?order=-source_created_at&limit=10`;
  const options = {
    url: url
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
         const imagesResponse = JSON.parse(body);
         resolve(imagesResponse);
         return;
      }
      reject(error);
    });
  });
};
