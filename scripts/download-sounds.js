const fs = require('fs');
const https = require('https');
const path = require('path');

const sounds = [
    { name: 'pop.mp3', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.m4a' },
    { name: 'success.mp3', url: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.m4a' }
];

const dest = path.join(__dirname, '../frontend/public/sounds');

if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
}

sounds.forEach(sound => {
    const file = fs.createWriteStream(path.join(dest, sound.name));
    https.get(sound.url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(() => console.log('Downloaded ' + sound.name));
        });
    });
});
