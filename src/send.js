const config = require('config');
const request = require('request');

const PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN || config.get('pageAccessToken');

const callSendAPI = (event, messageData) => {
  const requestPromise = () => {
    return new Promise((resolve, reject) => {
      const params = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      };

      const callback = (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let recipientId = body.recipient_id;
          let messageId = body.message_id;

          if (messageId) {
            console.log("Successfully sent message with id %s to recipient %s",
              messageId, recipientId);
          } else {
            console.log("Successfully called Send API for recipient %s",
              recipientId);
          }
        } else {
          console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
        resolve({ error, response, body });
      };
      request(params, callback);
    });
  };

  return requestPromise()
    .then((response) => {
      return response;
    });
};

module.exports.typing = (event, on = true) => {
  let messageData = {
    recipient: { id: event.sender.id },
    sender_action: on ? 'typing_on' : 'typing_off'
  };
  return callSendAPI(event, messageData);
};;

module.exports.seen = (event) => {
  let messageData = {
    recipient: {
      id: event.sender.id
    },
    sender_action: 'mark_seen'
  }
  return callSendAPI(event, messageData);
};

module.exports.text = (event, data) => {
  let messageData = {
    recipient: {
      id: event.sender.id
    },
    message: {}
  };

  if (data.text) {
    messageData.message.text = data.text;
  }

  if (data.quickReplies && data.quickReplies.length) {
    messageData.message.quick_replies = data.quickReplies.map(reply => {
      return Object.assign({ content_type: 'text' }, reply);
    });
  }

  return callSendAPI(event, messageData);
};

module.exports.generic = (event, data) => {
  if (!data.elements) {
    throw error('generic template needs elements');
  }
  if (data.elements.length > 10) {
    throw error('generic template can only have 10 elements');
  }

  let messageData = {
    recipient: {
      id: event.sender.id
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: data.elements,
          image_aspect_ratio: data.imageAspectRatio || 'horizontal'
        }
      }
    }
  };

  if (data.quickReplies && data.quickReplies.length) {
    messageData.message.quick_replies = data.quickReplies;
  }

  return callSendAPI(event, messageData);
};

module.exports.button = (event, data) => {
  let messageData = {
    recipient: {
      id: event.sender.id
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: data.text,
          buttons: data.buttons
        }
      }
    }
  };
  return callSendAPI(event, messageData);
}


module.exports.list = (event, data) => {
  if (!data.elements && data.elements.length != 4) {
    throw Error('elements does not exist OR length is not equal 4');
  }
  let messageData = {
    recipient: { id: event.sender.id },
    message: {
      attachment: {
        type: 'template',
        payload: {
          top_element_style: data.topElementStyle || 'compact',
          template_type: 'list',
          elements: []
        }
      }
    }
  };

  if (data.quickReplies && data.quickReplies.length) {
    messageData.message.quick_replies = data.quickReplies;
  }

  if (data.buttons && data.buttons.length) {
    messageData.message.attachment.payload.buttons = data.buttons;
  }
  messageData.message.attachment.payload.elements = data.elements;
  return callSendAPI(event, messageData);
}
