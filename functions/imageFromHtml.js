const Airtable = require('airtable');
const https = require("https");
const axios = require('axios');

//const base = new Airtable({apiKey: process.env.VITE_AIRTABLE_KEY}).base('appls7XVxwxuDkhMg');

exports.handler = async function(event, context) {
  var info = JSON.parse(event.body)
  
  if (info !=null) {

    let headers = { 
      headers: {
        'Authorization': `Bearer ${process.env.VITE_AIRTABLE_TOKEN}` ,
        'Content-Type': 'application/json'
      }
    }

    var webhooks = []

    try {
      const response = await axios.get(`https://api.airtable.com/v0/bases/appls7XVxwxuDkhMg/webhooks/`, headers);
      console.log(response.data.webhooks);
      webhooks = response.data.webhooks;
    } catch (error) {
      console.error(error);
    }

    if (webhooks.length>0) {
      const cursorForCurrentPayload = webhooks[0].cursorForNextPayload-1

      var payloads = []

      try {
        const response = await axios.get(`https://api.airtable.com/v0/bases/appls7XVxwxuDkhMg/webhooks/${info.webhook.id}/payloads?cursor=${cursorForCurrentPayload}`, headers);
        console.log(response.data.payloads);
        payloads = response.data.payloads;
      } catch (error) {
        console.error(error);
      }
      
      if(payloads.length > 0) {
        
        var changedTable = payloads[0].changedTablesById.tbl898JpGTX96lpGu
        var createdRecord = Object.values(changedTable.createdRecordsById)[0]
    
        // Create an image by sending a POST to the API.
        // Retrieve your api_id and api_key from the Dashboard. https://htmlcsstoimage.com/dashboard
        const htmlemail = { html: createdRecord.cellValuesByFieldId.fldRdqWqZcbschJ6M };
    
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
        //console.log(changedTable.createdRecordsById)
        const recordById = changedTable.createdRecordsById;
        console.log(Object.keys(recordById)[0])
    
        updateMail(Object.keys(recordById)[0], imageUrl)
      }
    }
  }


  return {
      statusCode: 200
  }
}

const updateMail = async (id, imageUrl) => {
  return new Promise((resolve, reject) => {
    const { VITE_AIRTABLE_KEY: apiKey, } = process.env;
    //console.log(fields)
    Airtable.configure({
      apiKey
    });

    const base = Airtable.base('appls7XVxwxuDkhMg');
    base('Emails').update([
      {
        "id": id,
        "fields": {
          "RenderedImageUrl": imageUrl
        }
      }
    ], err => {
      if (err) return reject(err);

      resolve();
    });
  });
};
