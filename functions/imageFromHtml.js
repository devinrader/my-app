const Airtable = require('airtable');
const https = require("https");
const axios = require('axios');

const base = new Airtable({apiKey: import.meta.env.VITE_AIRTABLE_KEY}).base('appls7XVxwxuDkhMg');

exports.handler = async function(event, context) {
  var body = JSON.parse(event.body);

  if(body != null && body.data != null) {
    var data = body.data;
    
    //get the data from the webhook body payload
    var email = payloads[0].actionMetadata.sourceMetadata.email

    // Create an image by sending a POST to the API.
    // Retrieve your api_id and api_key from the Dashboard. https://htmlcsstoimage.com/dashboard
    var imageurl = createImage(email.html);

    //update the airtable record
    base('Emails').update({
      From: data.from,
      Subject: data.subject,
      Html: data.html,
      Plain: data.text,
      Headers: data.headers
    }, err => {
      if (err) { console.error(err); return; }
      console.log('Message saved to Airtable')
      res.status(200).end();
    })
  }
  return {
      statusCode: 200
  }
}


async function createImage(html) {
  const payload = { html: html };

  let headers = { auth: {
    username: import.meta.env.VITE_HTMLTOIMAGE_USERID,
    password: import.meta.env.VITE_HTMLTOIMAGE_KEY
  },
  headers: {
    'Content-Type': 'application/json'
  }
  }
  try {
    const response = await axios.post('https://hcti.io/v1/image', JSON.stringify(payload), headers);
    console.log(response.data.url);
    return response.data.url;
  } catch (error) {
    console.error(error);
  }
}

