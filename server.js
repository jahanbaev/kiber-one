const fs = require('fs');
const request = require('request');

const SendFile = (path) =>{
  
  const formData = {
    uploadedFile: fs.createReadStream('./assets/a.png'),
    filePath: "tester", // don't put / end and start of string
    userName: "samandar"
  };

  request.post({url:'https://wqqq.ru/upload.php', formData: formData}, function(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Server responded with:', httpResponse.statusCode, body);
  });

}
