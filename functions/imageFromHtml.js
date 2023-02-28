const Airtable = require('airtable');
const https = require("https");
const axios = require('axios');

const base = new Airtable({apiKey: process.env.VITE_AIRTABLE_KEY}).base('appls7XVxwxuDkhMg');

exports.handler = async function(event, context) {
  var body = JSON.parse(event.body);
  if(body != null && body.payloads != null && body.payloads.length > 0) {
    var payloads = body.payloads

    var changedTable = payloads[0].changedTablesById
    var createdRecord = Object.values(changedTable)[0].createdRecordsById
    console.log(changedTable)
    console.log(createdRecord)

    // Create an image by sending a POST to the API.
    // Retrieve your api_id and api_key from the Dashboard. https://htmlcsstoimage.com/dashboard
    const htmlemail = { html: createdRecord.cellValuesByFieldId.Html };

    var imageUrl = ''

    let headers = { auth: {
      username: process.env.VITE_HTMLTOIMAGE_USERID,
      password: process.env.VITE_HTMLTOIMAGE_KEY
    },
    headers: {
      'Content-Type': 'application/json'
    }
    }
    try {
      const response = await axios.post('https://hcti.io/v1/image', JSON.stringify(htmlemail), headers);
      console.log(response.data.url);
      imageUrl = response.data.url;
    } catch (error) {
      console.error(error);
    }

    console.log(imageUrl)
    //update the airtable record
    base('Emails').update([
      {
        "id":object.values(createdRecord)[0],
        "fields": {
          "RenderedImageUrl": imageUrl
        }
      }
    ], err => {
      if (err) { console.error(err); return; }
      console.log('Message saved to Airtable')
      res.status(200).end();
    })
  }
  return {
      statusCode: 200
  }
}


// async function createImage(html) {

// }

