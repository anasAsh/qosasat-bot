const
  api = require('./api'),
  redis = require('./redis'),
  send = require('./send');

module.exports = (event) => {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = JSON.parse(event.postback.payload);
  if (payload.image_url) {
    redis.setNextIntent(senderID, {type: 'create_image', image_url: payload.image_url});
    send.text(event, {text: 'يرجى كتابة نص القصاصة, مثلا:'})
      .then(() => {
        let suggestedTexts = [
          `قد تورقُ الأشجارُ ذاتَ خريفِ في شوقِ
غصنٍ للـِ حفيفِ
ما دامَ إحساسُ
الحياةِ مهيمناً والروح ملهمةً بكل ألي…`
          ,
          `حيث لا تقدرُ بقيةُ الأشجارِ على البقاء بسبب ظروفِ المناخ القاسية
 تعيشُ أشجارُ اللزّاب المعمّرة
 هي لا تنتظمُ`,
          `فقد تورقُ الأشجارُ بعد ذبولها ويخضرّ ساق النّبت وهو هشيمُ
 إذا ما أراد اللهُ إتمام حاجةٍ أتتكَ على سفرً وأنت مقيمُ ❤️`,
          `أُريدكِ أن تُحبيني وَكأنك لمّ
تَعرفِ معنى الحُب إلا مَعي `,
        ];
        const randomIndex = Math.floor(Math.random() * (suggestedTexts.length - 1));
        return send.text(event, {text: suggestedTexts[randomIndex]});
      });

  } else {
    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    send.text(event, {text: 'غير متاح'});
  }
}
