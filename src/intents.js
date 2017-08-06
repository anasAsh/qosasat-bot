const
  api = require('./api'),
  send = require('./send');

module.exports = {
  welcome: (event, params) => {
    const helloMessage = 'ابحث عن صورة (أمثلة: جبال ثلجية، غروب الشمس، سيارة سباق، باقة زهر، فتاة، رمل شاطئ...)';
    send.text(event, {text: helloMessage})
      .then(() => {
        return send.text(event, {text: 'او اختر واحدة من الصور التالية'});
      })
      .then(() => {
        api.suggest()
          .then((imagesResult) => {
            if (imagesResult.result.length) {
              const elements = createImagesElements(imagesResult.result);
              send.generic(event, {elements: elements});
            } else {
              send.text(event, {text: 'عذراً, لم اجد اي صور مناسبة'});
            }
          });
      });
  },
  search: (event, params) => {
    api.search(params.q)
      .then((imagesResult) => {
        if (imagesResult.result.length) {
          const elements = createImagesElements(imagesResult.result);
          send.generic(event, {elements: elements});
        } else {
          send.text(event, {text: 'عذراً, لم اجد اي صور مناسبة'});
        }
      });
  },

}


function createImagesElements(imagesData) {
  return imagesData.map((image, index) => {
    return {
      title: `image #${index}`,
      subtitle: image.source_photographer_name,
      // item_url: "https://www.oculus.com/en-us/touch/",
      image_url: image.resizable_serve_url_template.replace('WIDTH', '400').replace('HEIGHT', '200'),
      buttons: [{
        type: "postback",
        title: "اصنع قصاصة",
        payload: JSON.stringify({image_url: image.resizable_serve_url_template}),
      }]
    };
  });
}
