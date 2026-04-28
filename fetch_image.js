const https = require('https');
https.get('https://unsplash.com/photos/GeEP-h714rc', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<meta property="og:image" content="(.*?)"/);
    if(match) console.log(match[1]);
    else console.log("Not found");
  });
}).on('error', console.error);
