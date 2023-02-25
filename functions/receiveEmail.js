const https = require("https");
const Airtable = require('airtable');
const Busboy = require('busboy');

const base = new Airtable({apiKey: process.env.VITE_AIRTABLE_KEY}).base('appls7XVxwxuDkhMg');

exports.handler = async function(event, context) {
  console.log(event.body)

  const fields = await parseMultipartForm(event)

  /console.log(fields)
  //if(body != null && body.data != null) {
  //  var data = body.data;
  //  console.log(data)    
  base('Emails').create({
    From: fields["from"],
    Subject: fields["subject"],
    Html: fields["html"],
    Plain: fields["text"],
    Headers: fields["headers"]
  }, err => {
    if (err) { console.error(err); return; }
    console.log('Message saved to Airtable')
    res.status(200).end();
  })
  //}
  return {
      statusCode: 200
  }
}

// https://answers.netlify.com/t/trouble-with-handling-files-in-netlify-function/42418/34
function parseMultipartForm(event) {
  return new Promise((resolve) => {
    console.log("Starting parse")
    // we'll store all form fields inside of this
    const fields = {};

    const busboy = Busboy({
      headers: event.headers
    });

    busboy.on("file", (fieldname, filestream, fileinfo) => {
      const { filename, transferEncoding, mimeType } = info
      filestream.on("data", (data) => {
        if (!fields[fieldname]) {
          fields[fieldname] = []
        }

        fields[fieldname].push({
          filename,
          type: mimeType,
          content: data,
        });
      });
    });

    busboy.on("field", (fieldName, value) => {
      console.log(`Field Found ${fieldName}`)
      fields[fieldName] = value;
    });

    busboy.on("close", () => {
      resolve(fields)
    });

    busboy.end(Buffer.from(event.body, 'base64'))
  });
}
