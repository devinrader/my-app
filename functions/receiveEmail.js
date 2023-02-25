const https = require("https");
const Airtable = require('airtable');
const Busboy = require('busboy');


exports.handler = async function(event, context) {
  const fields = await parseMultipartForm(event)

  await saveMail(fields)

  console.log('Email Saved')
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

const saveMail = async (fields) => {
  return new Promise((resolve, reject) => {
    const { VITE_AIRTABLE_KEY: apiKey, } = process.env;
console.log(fields)
    Airtable.configure({
      apiKey
    });

    const base = Airtable.base('appls7XVxwxuDkhMg');
    base('Emails').create([
      {
        "fields": {
          From: fields["from"],
          Subject: fields["subject"],
          Html: fields["html"],
          Plain: fields["text"],
          Headers: fields["headers"]
        }
      }
    ], err => {
      if (err) return reject(err);

      resolve();
    });
  });
};