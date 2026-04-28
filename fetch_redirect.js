const https = require('https');
https.get('https://source.unsplash.com/GeEP-h714rc', (res) => {
  console.log(res.statusCode, res.headers.location);
}).on('error', console.error);
