const Airtable = require('airtable');
const https = require("https");

const base = new Airtable({apiKey: import.meta.env.VITE_AIRTABLE_KEY}).base('appls7XVxwxuDkhMg');

exports.handler = async function(event, context) {
  var body = JSON.parse(event.body);

  if(body != null && body.data != null) {
    var data = body.data;
      
    base('Emails').create({
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
