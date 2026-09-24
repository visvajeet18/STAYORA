const fs = require('fs');
let data = fs.readFileSync('src/store/hotelsSlice.js', 'utf8');
let id = 1;
data = data.replace(/imageUrl:\s*'[^']+'/g, () => `imageUrl: 'https://picsum.photos/seed/hotel${id++}/800/500'`);
fs.writeFileSync('src/store/hotelsSlice.js', data);
console.log('Fixed images');
